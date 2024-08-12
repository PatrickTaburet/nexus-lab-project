<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240511150609 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_G1artwork_like (scene1_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_1D17C4971A763A55 (scene1_id), INDEX IDX_1D17C497A76ED395 (user_id), PRIMARY KEY(scene1_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_D1artwork_like (scene_d1_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_6176E14C7C71C704 (scene_d1_id), INDEX IDX_6176E14CA76ED395 (user_id), PRIMARY KEY(scene_d1_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_G1artwork_like ADD CONSTRAINT FK_1D17C4971A763A55 FOREIGN KEY (scene1_id) REFERENCES scene1 (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_G1artwork_like ADD CONSTRAINT FK_1D17C497A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_D1artwork_like ADD CONSTRAINT FK_6176E14C7C71C704 FOREIGN KEY (scene_d1_id) REFERENCES scene_d1 (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_D1artwork_like ADD CONSTRAINT FK_6176E14CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_artwork_like DROP FOREIGN KEY FK_A2ABB1FF1A763A55');
        $this->addSql('ALTER TABLE user_artwork_like DROP FOREIGN KEY FK_A2ABB1FFA76ED395');
        $this->addSql('DROP TABLE user_artwork_like');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_artwork_like (scene1_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_A2ABB1FF1A763A55 (scene1_id), INDEX IDX_A2ABB1FFA76ED395 (user_id), PRIMARY KEY(scene1_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_artwork_like ADD CONSTRAINT FK_A2ABB1FF1A763A55 FOREIGN KEY (scene1_id) REFERENCES scene1 (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_artwork_like ADD CONSTRAINT FK_A2ABB1FFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_G1artwork_like DROP FOREIGN KEY FK_1D17C4971A763A55');
        $this->addSql('ALTER TABLE user_G1artwork_like DROP FOREIGN KEY FK_1D17C497A76ED395');
        $this->addSql('ALTER TABLE user_D1artwork_like DROP FOREIGN KEY FK_6176E14C7C71C704');
        $this->addSql('ALTER TABLE user_D1artwork_like DROP FOREIGN KEY FK_6176E14CA76ED395');
        $this->addSql('DROP TABLE user_G1artwork_like');
        $this->addSql('DROP TABLE user_D1artwork_like');
    }
}
