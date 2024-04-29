<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240429163955 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE scene_d1 ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE scene_d1 ADD CONSTRAINT FK_B8CF8882A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_B8CF8882A76ED395 ON scene_d1 (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE scene_d1 DROP FOREIGN KEY FK_B8CF8882A76ED395');
        $this->addSql('DROP INDEX IDX_B8CF8882A76ED395 ON scene_d1');
        $this->addSql('ALTER TABLE scene_d1 DROP user_id');
    }
}
