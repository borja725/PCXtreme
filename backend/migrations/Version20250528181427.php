<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250528181427 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE review DROP FOREIGN KEY FK_794381C64584665A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review CHANGE rating rating DOUBLE PRECISION NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_794381c64584665a ON review
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_794381C67645698E ON review (producto_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review ADD CONSTRAINT FK_794381C64584665A FOREIGN KEY (producto_id) REFERENCES producto (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE review DROP FOREIGN KEY FK_794381C67645698E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review CHANGE rating rating INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_794381c67645698e ON review
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_794381C64584665A ON review (producto_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE review ADD CONSTRAINT FK_794381C67645698E FOREIGN KEY (producto_id) REFERENCES producto (id)
        SQL);
    }
}
