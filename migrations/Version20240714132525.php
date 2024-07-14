<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240714132525 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE scene_d2 (id INT AUTO_INCREMENT NOT NULL, div_factor INT NOT NULL, copy INT NOT NULL, deformation INT NOT NULL, size_factor DOUBLE PRECISION NOT NULL, angle INT NOT NULL, opacity DOUBLE PRECISION NOT NULL, filters INT NOT NULL, division INT NOT NULL, color_range INT NOT NULL, glitch SMALLINT NOT NULL, noise SMALLINT NOT NULL, title VARCHAR(100) DEFAULT NULL, comment VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE scene_d2');
    }
}
