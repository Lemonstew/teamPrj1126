USE teamPrj1126;

CREATE TABLE plan
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    inserted    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title       VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    destination VARCHAR(20),
    startDate   DATE,
    endDate     DATE,
    updated     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    writer      VARCHAR(20) NOT NULL REFERENCES member (email),
    pinned      BOOLEAN   DEFAULT FALSE,
    FOREIGN KEY (writer) REFERENCES member (email) ON DELETE CASCADE
);

DROP TABLE plan;

ALTER TABLE plan
    ADD COLUMN updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE plan
    MODIFY title VARCHAR(50) NOT NULL;

ALTER TABLE plan
    MODIFY description VARCHAR(100) NOT NULL;

ALTER TABLE plan
    ADD COLUMN pinned BOOLEAN DEFAULT FALSE;

ALTER TABLE plan
    ADD COLUMN writer VARCHAR(20) NOT NULL REFERENCES member (email) AFTER updated;

ALTER TABLE plan
    ADD CONSTRAINT
        FOREIGN KEY (writer) REFERENCES member (email) ON DELETE CASCADE;

ALTER TABLE plan
    ADD COLUMN payment_detail_id INT REFERENCES payment_detail (id);

SHOW CREATE TABLE plan;