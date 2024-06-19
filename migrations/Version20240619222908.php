<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240619222908 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE scene2 (id INT AUTO_INCREMENT NOT NULL, hue INT NOT NULL, color_range INT NOT NULL, brightness INT NOT NULL, movement DOUBLE PRECISION NOT NULL, deform_a DOUBLE PRECISION NOT NULL, deform_b DOUBLE PRECISION NOT NULL, shape DOUBLE PRECISION NOT NULL, rings DOUBLE PRECISION NOT NULL, diameter DOUBLE PRECISION NOT NULL, zoom DOUBLE PRECISION NOT NULL, title VARCHAR(100) DEFAULT NULL, comment VARCHAR(255) DEFAULT NULL, image_name VARCHAR(255) DEFAULT NULL, updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE scene2');
    }
}
