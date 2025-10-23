<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250519095253 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE box (id_box INT AUTO_INCREMENT NOT NULL, couleur VARCHAR(50) DEFAULT NULL, nom VARCHAR(50) DEFAULT NULL, PRIMARY KEY(id_box)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE chien (id_chien INT AUTO_INCREMENT NOT NULL, nom_chien VARCHAR(50) NOT NULL, race VARCHAR(50) DEFAULT NULL, idProprio INT NOT NULL, INDEX IDX_13A4067E694D9874 (idProprio), PRIMARY KEY(id_chien)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE comptabilite (id INT AUTO_INCREMENT NOT NULL, tarif_id INT NOT NULL, paiement_id INT DEFAULT NULL, nombre_chien INT NOT NULL, nombre_box INT NOT NULL, date_arrivee DATE NOT NULL, date_depart DATE NOT NULL, montant_total VARCHAR(50) NOT NULL, commentaires LONGTEXT DEFAULT NULL, idProprio INT DEFAULT NULL, INDEX IDX_A737A41B694D9874 (idProprio), INDEX IDX_A737A41B357C0A59 (tarif_id), INDEX IDX_A737A41B2A4C4478 (paiement_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE occupation (id_occupation INT AUTO_INCREMENT NOT NULL, id_chien INT NOT NULL, comptabilite_id INT NOT NULL, id_box INT NOT NULL, INDEX IDX_2F87D51FD21474E (id_chien), INDEX IDX_2F87D514E455E4 (comptabilite_id), INDEX IDX_2F87D51960DA060 (id_box), PRIMARY KEY(id_occupation)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE paiement (id_paiement INT AUTO_INCREMENT NOT NULL, type VARCHAR(50) NOT NULL, PRIMARY KEY(id_paiement)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE proprietaire (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, prenom VARCHAR(50) NOT NULL, contact VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tarif (id_tarif INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(50) NOT NULL, montant VARCHAR(50) NOT NULL, PRIMARY KEY(id_tarif)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chien ADD CONSTRAINT FK_13A4067E694D9874 FOREIGN KEY (idProprio) REFERENCES proprietaire (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comptabilite ADD CONSTRAINT FK_A737A41B694D9874 FOREIGN KEY (idProprio) REFERENCES proprietaire (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comptabilite ADD CONSTRAINT FK_A737A41B357C0A59 FOREIGN KEY (tarif_id) REFERENCES tarif (id_tarif)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comptabilite ADD CONSTRAINT FK_A737A41B2A4C4478 FOREIGN KEY (paiement_id) REFERENCES paiement (id_paiement)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE occupation ADD CONSTRAINT FK_2F87D51FD21474E FOREIGN KEY (id_chien) REFERENCES chien (id_chien) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE occupation ADD CONSTRAINT FK_2F87D514E455E4 FOREIGN KEY (comptabilite_id) REFERENCES comptabilite (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE occupation ADD CONSTRAINT FK_2F87D51960DA060 FOREIGN KEY (id_box) REFERENCES box (id_box) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE chien DROP FOREIGN KEY FK_13A4067E694D9874
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comptabilite DROP FOREIGN KEY FK_A737A41B694D9874
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comptabilite DROP FOREIGN KEY FK_A737A41B357C0A59
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE comptabilite DROP FOREIGN KEY FK_A737A41B2A4C4478
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE occupation DROP FOREIGN KEY FK_2F87D51FD21474E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE occupation DROP FOREIGN KEY FK_2F87D514E455E4
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE occupation DROP FOREIGN KEY FK_2F87D51960DA060
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE box
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE chien
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE comptabilite
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE occupation
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE paiement
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE proprietaire
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tarif
        SQL);
    }
}
