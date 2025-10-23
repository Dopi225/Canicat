<?php
namespace App\Entity;

use App\Entity\Comptabilite;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\TarifRepository;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: TarifRepository::class)]
#[ApiResource()]
class Tarif
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: "id_tarif")]
    private ?int $idTarif = null;

    #[ORM\Column(length: 50)]
    private string $libelle;

    #[ORM\Column(length: 50)]
    private string $montant;

    #[ORM\OneToMany(targetEntity: Comptabilite::class, mappedBy: "tarif", cascade: ["remove"], orphanRemoval: true)]
    private Collection $comptabilites;

    public function __construct()
    {
        $this->comptabilites = new ArrayCollection();
    }


    // Getters and setters...
    public function getId(): ?int
    {
        return $this->idTarif;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getMontant(): ?string
    {
        return $this->montant;
    }

    public function setMontant(string $montant): static
    {
        $this->montant = $montant;

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
            $comptabilite->setTarif($this);
        }
        return $this;
    }

    public function removeComptabilite(Comptabilite $comptabilite): static
    {
        if ($this->comptabilites->removeElement($comptabilite)) {
            // Set the owning side to null (unless already changed)
            if ($comptabilite->getTarif() === $this) {
                $comptabilite->setTarif(null);
            }
        }
        return $this;
    }
}
