import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function setupAuth(app: Express) {
  const PostgresStore = connectPg(session);

  const sessionSettings: session.SessionOptions = {
    secret: "crypto-platform-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new PostgresStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    })
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Create default user if none exists
  const defaultUser = await storage.getUserByUsername("demo");
  if (!defaultUser) {
    await storage.createUser({
      username: "demo",
      email: "demo@example.com",
      password: await hashPassword("demo"),
      isVerified: true
    });
  }

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Attempting login for user:", username);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log("User not found:", username);
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          console.log("Invalid password for user:", username);
          return done(null, false, { message: "Invalid username or password" });
        }

        console.log("Login successful for user:", username);
        return done(null, user);
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("Deserializing user:", id);
      const user = await storage.getUser(id);
      if (!user) {
        console.log("User not found during deserialization:", id);
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Deserialization error:", error);
      done(error);
    }
  });

  // Auto-login middleware for demo purposes
  app.use(async (req, res, next) => {
    if (!req.user) {
      const demoUser = await storage.getUserByUsername("demo");
      if (demoUser) {
        req.login(demoUser, (err) => {
          if (err) {
            console.error("Auto-login error:", err);
          }
          next();
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.user) {
      console.log("No authenticated user");
      return res.sendStatus(401);
    }
    console.log("User data requested for:", req.user?.id);
    res.json(req.user);
  });
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}