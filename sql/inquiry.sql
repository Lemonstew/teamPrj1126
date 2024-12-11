USE teamPrj1126;

CREATE TABLE inquiry
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    writer   VARCHAR(20)  NOT NULL REFERENCES member (nickname),
    category VARCHAR(20)  NOT NULL,
    title    VARCHAR(50)  NOT NULL,
    content  VARCHAR(500) NOT NULL,
    secret   BOOLEAN   DEFAULT FALSE,
    inserted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP Table inquiry;

