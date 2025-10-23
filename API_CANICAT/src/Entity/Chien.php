<?php
namespace App\Entity;

use App\Entity\Occupation;
use App\Entity\Proprietaire;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ChienRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: ChienRepository::class)]
#[ApiResource()]
class Chien
{
     #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: "id_chien")]
    private ?int $idChien = null;

    #[ORM\Column(length: 50)]
    private string $nomChien;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $race = null;

    #[ORM\ManyToOne(targetEntity: Proprietaire::class, inversedBy: "chiens")]
    #[ORM\JoinColumn(name: "idProprio", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Proprietaire $proprietaire = null;

    #[ORM\OneToMany(targetEntity: Occupation::class, mappedBy: "chien", cascade: ["remove"], orphanRemoval: true)]
    private Collection $occupations;

    public function __construct()
    {
        $this->occupations = new ArrayCollection();
    }

    // Getters and setters...
    public function getId(): ?int
    {
        return $this->idChien;
    }

    public function getRace(): ?string
    {
        return $this->race;
    }

    public function setRace(string $race): static
    {
        $this->race = $race;

        return $this;
    }

    public function getNomChien(): ?string
    {
        return $this->nomChien;
    }

    public function setNomChien(string $nomChien): static
    {
        $this->nomChien = $nomChien;

        return $this;
    }

    public function getProprio(): ?Proprietaire
    {
        return $this->proprietaire;
    }

    public function setProprio(Proprietaire $proprietaire): static
    {
        $this->proprietaire = $proprietaire;

        return $this;
    }
    public function getOccupations(): Collection
{
    return $this->occupations;
}

public function addOccupation(Occupation $occupation): static
{
    if (!$this->occupations->contains($occupation)) {
        $this->occupations[] = $occupation;
        $occupation->setChien($this);
    }

    return $this;
}

public function removeOccupation(Occupation $occupation): static
{
    if ($this->occupations->removeElement($occupation)) {
        // set the owning side to null (unless already changed)
        if ($occupation->getChien() === $this) {
            $occupation->setChien(null);
        }
    }

    return $this;
}
}
