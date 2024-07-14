<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240714134022 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_D2artwork_like (scene_d2_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_DCBC8D826EC468EA (scene_d2_id), INDEX IDX_DCBC8D82A76ED395 (user_id), PRIMARY KEY(scene_d2_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_D2artwork_like ADD CONSTRAINT FK_DCBC8D826EC468EA FOREIGN KEY (scene_d2_id) REFERENCES scene_d2 (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_D2artwork_like ADD CONSTRAINT FK_DCBC8D82A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_D2artwork_like DROP FOREIGN KEY FK_DCBC8D826EC468EA');
        $this->addSql('ALTER TABLE user_D2artwork_like DROP FOREIGN KEY FK_DCBC8D82A76ED395');
        $this->addSql('DROP TABLE user_D2artwork_like');
    }
}
