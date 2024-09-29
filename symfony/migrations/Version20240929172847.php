<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240929172847 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_g1artwork_like DROP FOREIGN KEY FK_1D17C4971A763A55');
        $this->addSql('ALTER TABLE user_g1artwork_like ADD CONSTRAINT FK_1D17C4971A763A55 FOREIGN KEY (scene1_id) REFERENCES scene1 (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_G1artwork_like DROP FOREIGN KEY FK_1D17C4971A763A55');
        $this->addSql('ALTER TABLE user_G1artwork_like ADD CONSTRAINT FK_1D17C4971A763A55 FOREIGN KEY (scene1_id) REFERENCES scene1 (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
