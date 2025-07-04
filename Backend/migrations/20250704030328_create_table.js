/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema
    // USERS
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("fullName").notNullable();
      table.string("phone", 11).unique().notNullable();
      table.string("email", 50).unique().notNullable();
      table.string("password").notNullable();
      table.string("tokenUser").unique().notNullable();
      table.enu("role", ["student", "parent"]).notNullable();
      table.enu("status", ["ACTIVE", "INACTIVE"]).defaultTo("INACTIVE");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })

    // ACCOUNTS
    .createTable("accounts", (table) => {
      table.increments("id").primary();
      table.string("fullName").notNullable();
      table.string("phone", 11).unique().notNullable();
      table.string("email", 50).unique().notNullable();
      table.string("password").notNullable();
      table.string("tokenAccount").unique().notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })

    // PARENT_STUDENT
    .createTable("parent_student", (table) => {
      table.integer("parent_id").references("id").inTable("users").onDelete("CASCADE");
      table.integer("student_id").references("id").inTable("users").onDelete("CASCADE");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.primary(["parent_id", "student_id"]);
    })

    // WALLETS
    .createTable("wallets", (table) => {
      table.increments("id").primary();
      table.integer("studentId").unique().references("id").inTable("users").onDelete("CASCADE");
      table.integer("balance").defaultTo(0);
      table.enu("status", ["ACTIVE", "inactive"]).defaultTo("inactive");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })

    // COURSES
    .createTable("courses", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.text("description");
      table.text("thumbnail");
      table.enu("status", ["active", "inactive"]).defaultTo("active");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })

    // CHAPTERS
    .createTable("chapters", (table) => {
      table.increments("id").primary();
      table.integer("courseId").notNullable().references("id").inTable("courses").onDelete("CASCADE");
      table.string("title").notNullable();
      table.integer("position").defaultTo(1);
      table.enu("status", ["active", "inactive"]).defaultTo("active");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })

    // LESSONS
    .createTable("lessons", (table) => {
      table.increments("id").primary();
      table.integer("chapterId").notNullable().references("id").inTable("chapters").onDelete("CASCADE");
      table.string("title").notNullable();
      table.text("videoUrl");
      table.integer("position").defaultTo(1);
      table.integer("duration").defaultTo(0);
      table.integer("token").notNullable().defaultTo(10);
      table.enu("status", ["active", "inactive"]).defaultTo("active");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })

    // PROGRESS
    .createTable("progress", (table) => {
      table.increments("id").primary();
      table.integer("studentId").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.integer("lessonId").notNullable().references("id").inTable("lessons").onDelete("CASCADE");
      table.integer("score");
      table.boolean("completed").defaultTo(false);
      table.timestamp("completedAt");
      table.integer("watchedDuration").defaultTo(0);
      table.integer("videoDuration").defaultTo(0);
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updatedAt").defaultTo(knex.fn.now());
      table.unique(["studentId", "lessonId"]);
    })

    // TRANSACTIONS
    .createTable("transactions", (table) => {
      table.increments("id").primary();
      table.integer("studentId").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.integer("lessonId").references("id").inTable("lessons").onDelete("SET NULL");
      table.integer("amount").notNullable();
      table.enu("type", ["reward", "refund"]).notNullable();
      table.text("description");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    })

    // PROPOSALS
    .createTable("proposals", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.text("description");
      table.enu("status", ["active", "inactive"]).defaultTo("active");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    })

    // VOTES
    .createTable("votes", (table) => {
      table.increments("id").primary();
      table.integer("parentId").references("id").inTable("users").onDelete("CASCADE");
      table.integer("proposalId").references("id").inTable("proposals").onDelete("CASCADE");
      table.boolean("vote").notNullable();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.unique(["parentId", "proposalId"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema
    .dropTableIfExists("votes")
    .dropTableIfExists("proposals")
    .dropTableIfExists("transactions")
    .dropTableIfExists("progress")
    .dropTableIfExists("lessons")
    .dropTableIfExists("chapters")
    .dropTableIfExists("courses")
    .dropTableIfExists("wallets")
    .dropTableIfExists("parent_student")
    .dropTableIfExists("accounts")
    .dropTableIfExists("users");
};
