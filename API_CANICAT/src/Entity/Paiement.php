<?php
namespace App\Entity;

use App\Entity\Comptabilite;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\PaiementRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: PaiementRepository::class)]
#[ApiResource()]
class Paiement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: "id_paiement")]
    private ?int $idPaiement = null;

    #[ORM\Column(length: 50)]
    private string $type;

    #[ORM\OneToMany(targetEntity: Comptabilite::class, mappedBy: "paiement", cascade: ["remove"], orphanRemoval: true)]
    private Collection $comptabilites;

    public function __construct()
    {
        $this->comptabilites = new ArrayCollection();
    }


    // Getters and setters...
    public function getId(): ?int
    {
        return $this->idPaiement;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

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
            $comptabilite->setPaiement($this);
        }
        return $this;
    }

    public function removeComptabilite(Comptabilite $comptabilite): static
    {
        if ($this->comptabilites->removeElement($comptabilite)) {
            // Set the owning side to null (unless already changed)
            if ($comptabilite->getPaiement() === $this) {
                $comptabilite->setPaiement(null);
            }
        }
        return $this;
    }
}
