import pool from "../../infra/db/db.infra";

export async function createTables() {
  try {
    const createPayments = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('PIX', 'CREDIT_CARD') NOT NULL,
      status ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
      buyer_name VARCHAR(255),
      buyer_email VARCHAR(255),
      amount INT NOT NULL,
      card_data TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

    const createRefunds = `
    CREATE TABLE IF NOT EXISTS refunds (
      id INT AUTO_INCREMENT PRIMARY KEY,
      payment_id INT NOT NULL,
      amount INT NOT NULL,
      refund_type ENUM('TOTAL', 'PARTIAL') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (payment_id) REFERENCES payments(id)
    );
  `;

    await pool.query(createPayments);
    await pool.query(createRefunds);
  } catch (error) {
    console.error("ERRO AO CRIAR TABELAS", error);
    process.exit(1);
  }
}

if (process.argv[2] === "createtables") {
  console.log(process.argv[2]);
  createTables().then(() => {
    console.log("Tabelas criadas");
    process.exit(0);
  });
}

