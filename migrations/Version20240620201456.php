<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240620201456 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_G2artwork_like (scene2_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_A0DDA8598C395BB (scene2_id), INDEX IDX_A0DDA859A76ED395 (user_id), PRIMARY KEY(scene2_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_G2artwork_like ADD CONSTRAINT FK_A0DDA8598C395BB FOREIGN KEY (scene2_id) REFERENCES scene2 (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_G2artwork_like ADD CONSTRAINT FK_A0DDA859A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE scene2 ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE scene2 ADD CONSTRAINT FK_7C0AFC28A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_7C0AFC28A76ED395 ON scene2 (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_G2artwork_like DROP FOREIGN KEY FK_A0DDA8598C395BB');
        $this->addSql('ALTER TABLE user_G2artwork_like DROP FOREIGN KEY FK_A0DDA859A76ED395');
        $this->addSql('DROP TABLE user_G2artwork_like');
        $this->addSql('ALTER TABLE scene2 DROP FOREIGN KEY FK_7C0AFC28A76ED395');
        $this->addSql('DROP INDEX IDX_7C0AFC28A76ED395 ON scene2');
        $this->addSql('ALTER TABLE scene2 DROP user_id');
    }
}
