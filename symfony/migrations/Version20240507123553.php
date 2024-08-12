<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240507123553 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE add_scene ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE add_scene ADD CONSTRAINT FK_64CAE51BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_64CAE51BA76ED395 ON add_scene (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE add_scene DROP FOREIGN KEY FK_64CAE51BA76ED395');
        $this->addSql('DROP INDEX IDX_64CAE51BA76ED395 ON add_scene');
        $this->addSql('ALTER TABLE add_scene DROP user_id');
    }
}
