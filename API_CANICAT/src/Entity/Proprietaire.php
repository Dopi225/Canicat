<?php
namespace App\Entity;

use App\Entity\Chien;
use App\Entity\Comptabilite;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProprietaireRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: ProprietaireRepository::class)]
#[ApiResource()]
class Proprietaire
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private string $nom;

    #[ORM\Column(length: 50)]
    private string $prenom;

    #[ORM\Column(length: 50)]
    private string $contact;

    #[ORM\OneToMany(targetEntity: Chien::class, mappedBy: "proprietaire", cascade: ["remove"], orphanRemoval: true)]
    private Collection $chiens;

    #[ORM\OneToMany(targetEntity: Comptabilite::class, mappedBy: "proprio", cascade: ["remove"], orphanRemoval: true)]
    private Collection $comptabilites;

    public function __construct()
    {
        $this->chiens = new ArrayCollection();
        $this->comptabilites = new ArrayCollection();
    }

    // Getters and setters...
    public function getIdProprio(): ?int
    {
        return $this->id;
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

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;
        return $this;
    }

    public function getContact(): ?string
    {
        return $this->contact;
    }

    public function setContact(string $contact): static
    {
        $this->contact = $contact;
        return $this;
    }

    /**
     * @return Collection|Chien[]
     */
    public function getChiens(): Collection
    {
        return $this->chiens;
    }

    public function addChien(Chien $chien): static
    {
        if (!$this->chiens->contains($chien)) {
            $this->chiens[] = $chien;
            $chien->setProprio($this);
        }
        return $this;
    }

    public function removeChien(Chien $chien): static
    {
        if ($this->chiens->removeElement($chien)) {
            // Set the owning side to null (unless already changed)
            if ($chien->getProprio() === $this) {
                $chien->setProprio(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection|Comptabilite[]
     */
    public function getComptabilites(): Collection
    {
        return $this->comptabilites;
    }

    public function addComptabilite(Comptabilite $comptabilite): static
    {
        if (!$this->comptabilites->contains($comptabilite)) {
            $this->comptabilites[] = $comptabilite;
            $comptabilite->setProprio($this);
        }
        return $this;
    }

    public function removeComptabilite(Comptabilite $comptabilite): static
    {
        if ($this->comptabilites->removeElement($comptabilite)) {
            // Set the owning side to null (unless already changed)
            if ($comptabilite->getProprio() === $this) {
                $comptabilite->setProprio(null);
            }
        }
        return $this;
    }
}
