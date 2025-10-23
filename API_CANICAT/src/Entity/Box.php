<?php
namespace App\Entity;

use App\Entity\Occupation;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\BoxRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: BoxRepository::class)]
#[ApiResource()]
class Box
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: "id_box")]
    private ?int $idBox = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $couleur = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $nom = null;

    #[ORM\OneToMany(targetEntity: Occupation::class, mappedBy: "box", cascade: ["remove"], orphanRemoval: true)]
    private Collection $occupations;

    public function __construct()
    {
        $this->occupations = new ArrayCollection();
    }

    // Getters and setters...
     public function getId(): ?int
    {
        return $this->idBox;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getCouleur(): ?string
    {
        return $this->couleur;
    }

    public function setCouleur(string $couleur): static
    {
        $this->couleur = $couleur;

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
        $occupation->setBox($this);
    }

    return $this;
}

public function removeOccupation(Occupation $occupation): static
{
    if ($this->occupations->removeElement($occupation)) {
        // set the owning side to null (unless already changed)
        if ($occupation->getBox() === $this) {
            $occupation->setBox(null);
        }
    }

    return $this;
}
}
