<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240423150559 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE scene1 ADD image_name VARCHAR(255) DEFAULT NULL, ADD updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE color color INT NOT NULL, CHANGE saturation saturation INT NOT NULL, CHANGE opacity opacity INT NOT NULL, CHANGE weight weight INT NOT NULL, CHANGE num_line num_line INT NOT NULL, CHANGE velocity velocity INT NOT NULL, CHANGE noise_octave noise_octave INT NOT NULL, CHANGE noise_falloff noise_falloff INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE scene1 DROP image_name, DROP updated_at, CHANGE color color INT DEFAULT NULL, CHANGE saturation saturation INT DEFAULT NULL, CHANGE opacity opacity INT DEFAULT NULL, CHANGE weight weight INT DEFAULT NULL, CHANGE num_line num_line INT DEFAULT NULL, CHANGE velocity velocity INT DEFAULT NULL, CHANGE noise_octave noise_octave INT DEFAULT NULL, CHANGE noise_falloff noise_falloff INT DEFAULT NULL');
    }
}
