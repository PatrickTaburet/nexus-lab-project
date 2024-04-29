<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240429163334 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE scene_d1 (id INT AUTO_INCREMENT NOT NULL, country1 VARCHAR(255) DEFAULT NULL, country2 VARCHAR(255) DEFAULT NULL, country3 VARCHAR(255) DEFAULT NULL, country4 VARCHAR(255) DEFAULT NULL, country5 VARCHAR(255) DEFAULT NULL, country6 VARCHAR(255) DEFAULT NULL, country7 VARCHAR(255) DEFAULT NULL, country8 VARCHAR(255) DEFAULT NULL, randomness DOUBLE PRECISION NOT NULL, looping TINYINT(1) NOT NULL, abstract TINYINT(1) NOT NULL, image_name VARCHAR(255) DEFAULT NULL, updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE scene_d1');
    }
}
