<?php
namespace App\Entity;

use App\Entity\Box;
use App\Entity\Chien;
use App\Entity\Comptabilite;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\OccupationRepository;


#[ORM\Entity(repositoryClass: OccupationRepository::class)]
#[ApiResource()]
class Occupation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: "id_occupation")]
    private ?int $idOccupation = null;

    #[ORM\ManyToOne(targetEntity: Chien::class, inversedBy: "occupations")]
    #[ORM\JoinColumn(name: "id_chien", referencedColumnName: "id_chien", nullable: false, onDelete: "CASCADE")]
    private ?Chien $chien = null;

    #[ORM\ManyToOne(targetEntity: Comptabilite::class, inversedBy: "occupations")]
    #[ORM\JoinColumn(name: "comptabilite_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Comptabilite $comptabilite = null;

    #[ORM\ManyToOne(targetEntity: Box::class, inversedBy: "occupations")]
    #[ORM\JoinColumn(name: "id_box", referencedColumnName: "id_box", nullable: false, onDelete: "CASCADE")]
    private ?Box $box = null;

    // Getters and setters...

     public function getId(): ?int
    {
        return $this->idOccupation;
    }

    public function getCompta(): ?Comptabilite
    {
        return $this->comptabilite;
    }

    public function setCompta(?Comptabilite $comptabilite): static
{
    $this->comptabilite = $comptabilite;

    return $this;
}


    public function getChien(): ?Chien
    {
        return $this->chien;
    }

    public function setChien(Chien $chien): static
    {
        $this->chien = $chien;

        return $this;
    }

    public function getBox(): ?Box
    {
        return $this->box;
    }

    public function setBox(Box $box): static
    {
        $this->box = $box;

        return $this;
    }

    
}
