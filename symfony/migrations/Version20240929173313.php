<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240929173313 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_g2artwork_like DROP FOREIGN KEY FK_A0DDA8598C395BB');
        $this->addSql('ALTER TABLE user_g2artwork_like ADD CONSTRAINT FK_A0DDA8598C395BB FOREIGN KEY (scene2_id) REFERENCES scene2 (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_d1artwork_like DROP FOREIGN KEY FK_6176E14C7C71C704');
        $this->addSql('DROP INDEX IDX_6176E14C7C71C704 ON user_d1artwork_like');
        $this->addSql('DROP INDEX `primary` ON user_d1artwork_like');
        $this->addSql('ALTER TABLE user_d1artwork_like CHANGE scene_d1_id sceneD1_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_d1artwork_like ADD CONSTRAINT FK_6176E14CFC45916D FOREIGN KEY (sceneD1_id) REFERENCES scene_d1 (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_6176E14CFC45916D ON user_d1artwork_like (sceneD1_id)');
        $this->addSql('ALTER TABLE user_d1artwork_like ADD PRIMARY KEY (sceneD1_id, user_id)');
        $this->addSql('ALTER TABLE user_d2artwork_like DROP FOREIGN KEY FK_DCBC8D826EC468EA');
        $this->addSql('DROP INDEX IDX_DCBC8D826EC468EA ON user_d2artwork_like');
        $this->addSql('DROP INDEX `primary` ON user_d2artwork_like');
        $this->addSql('ALTER TABLE user_d2artwork_like CHANGE scene_d2_id sceneD2_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_d2artwork_like ADD CONSTRAINT FK_DCBC8D82EEF03E83 FOREIGN KEY (sceneD2_id) REFERENCES scene_d2 (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_DCBC8D82EEF03E83 ON user_d2artwork_like (sceneD2_id)');
        $this->addSql('ALTER TABLE user_d2artwork_like ADD PRIMARY KEY (sceneD2_id, user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_D1artwork_like DROP FOREIGN KEY FK_6176E14CFC45916D');
        $this->addSql('DROP INDEX IDX_6176E14CFC45916D ON user_D1artwork_like');
        $this->addSql('DROP INDEX `PRIMARY` ON user_D1artwork_like');
        $this->addSql('ALTER TABLE user_D1artwork_like CHANGE sceneD1_id scene_d1_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_D1artwork_like ADD CONSTRAINT FK_6176E14C7C71C704 FOREIGN KEY (scene_d1_id) REFERENCES scene_d1 (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_6176E14C7C71C704 ON user_D1artwork_like (scene_d1_id)');
        $this->addSql('ALTER TABLE user_D1artwork_like ADD PRIMARY KEY (scene_d1_id, user_id)');
        $this->addSql('ALTER TABLE user_D2artwork_like DROP FOREIGN KEY FK_DCBC8D82EEF03E83');
        $this->addSql('DROP INDEX IDX_DCBC8D82EEF03E83 ON user_D2artwork_like');
        $this->addSql('DROP INDEX `PRIMARY` ON user_D2artwork_like');
        $this->addSql('ALTER TABLE user_D2artwork_like CHANGE sceneD2_id scene_d2_id INT NOT NULL');
        $this->addSql('ALTER TABLE user_D2artwork_like ADD CONSTRAINT FK_DCBC8D826EC468EA FOREIGN KEY (scene_d2_id) REFERENCES scene_d2 (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_DCBC8D826EC468EA ON user_D2artwork_like (scene_d2_id)');
        $this->addSql('ALTER TABLE user_D2artwork_like ADD PRIMARY KEY (scene_d2_id, user_id)');
        $this->addSql('ALTER TABLE user_G2artwork_like DROP FOREIGN KEY FK_A0DDA8598C395BB');
        $this->addSql('ALTER TABLE user_G2artwork_like ADD CONSTRAINT FK_A0DDA8598C395BB FOREIGN KEY (scene2_id) REFERENCES scene2 (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
