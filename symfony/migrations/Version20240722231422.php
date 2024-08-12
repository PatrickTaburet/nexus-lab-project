<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240722231422 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_g1artwork_like DROP FOREIGN KEY FK_1D17C4971A763A55');
        $this->addSql('ALTER TABLE user_g1artwork_like ADD CONSTRAINT FK_1D17C4971A763A55 FOREIGN KEY (scene1_id) REFERENCES scene1 (id)');
        $this->addSql('ALTER TABLE user_g2artwork_like DROP FOREIGN KEY FK_A0DDA8598C395BB');
        $this->addSql('ALTER TABLE user_g2artwork_like ADD CONSTRAINT FK_A0DDA8598C395BB FOREIGN KEY (scene2_id) REFERENCES scene2 (id)');
        $this->addSql('ALTER TABLE user_d1artwork_like DROP FOREIGN KEY FK_6176E14C7C71C704');
        $this->addSql('ALTER TABLE user_d1artwork_like ADD CONSTRAINT FK_6176E14C7C71C704 FOREIGN KEY (scene_d1_id) REFERENCES scene_d1 (id)');
        $this->addSql('ALTER TABLE scene_d2 DROP size_factor');
        $this->addSql('ALTER TABLE user_d2artwork_like DROP FOREIGN KEY FK_DCBC8D826EC468EA');
        $this->addSql('ALTER TABLE user_d2artwork_like ADD CONSTRAINT FK_DCBC8D826EC468EA FOREIGN KEY (scene_d2_id) REFERENCES scene_d2 (id)');
        $this->addSql('ALTER TABLE messenger_messages CHANGE created_at created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE available_at available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE delivered_at delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE messenger_messages CHANGE created_at created_at DATETIME NOT NULL, CHANGE available_at available_at DATETIME NOT NULL, CHANGE delivered_at delivered_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE scene_d2 ADD size_factor DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE user_D1artwork_like DROP FOREIGN KEY FK_6176E14C7C71C704');
        $this->addSql('ALTER TABLE user_D1artwork_like ADD CONSTRAINT FK_6176E14C7C71C704 FOREIGN KEY (scene_d1_id) REFERENCES scene_d1 (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_D2artwork_like DROP FOREIGN KEY FK_DCBC8D826EC468EA');
        $this->addSql('ALTER TABLE user_D2artwork_like ADD CONSTRAINT FK_DCBC8D826EC468EA FOREIGN KEY (scene_d2_id) REFERENCES scene_d2 (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_G1artwork_like DROP FOREIGN KEY FK_1D17C4971A763A55');
        $this->addSql('ALTER TABLE user_G1artwork_like ADD CONSTRAINT FK_1D17C4971A763A55 FOREIGN KEY (scene1_id) REFERENCES scene1 (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_G2artwork_like DROP FOREIGN KEY FK_A0DDA8598C395BB');
        $this->addSql('ALTER TABLE user_G2artwork_like ADD CONSTRAINT FK_A0DDA8598C395BB FOREIGN KEY (scene2_id) REFERENCES scene2 (id) ON UPDATE NO ACTION ON DELETE CASCADE');
    }
}
