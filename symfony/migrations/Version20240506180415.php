<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240506180415 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user ADD role_request_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649CD4AD289 FOREIGN KEY (role_request_id) REFERENCES artist_role (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649CD4AD289 ON user (role_request_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649CD4AD289');
        $this->addSql('DROP INDEX UNIQ_8D93D649CD4AD289 ON user');
        $this->addSql('ALTER TABLE user DROP role_request_id');
    }
}
