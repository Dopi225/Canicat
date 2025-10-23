<?php

namespace App\Entity;

use App\Entity\Tarif;
use App\Entity\Paiement;
use App\Entity\Occupation;
use App\Entity\Proprietaire;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ComptabiliteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: ComptabiliteRepository::class)]
#[ApiResource()]
class Comptabilite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $nombreChien = null;

    #[ORM\Column]
    private ?int $nombreBox = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateArrivee = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateDepart = null;

    #[ORM\Column(length: 50)]
    private ?string $montantTotal = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $commentaires = null;

    #[ORM\ManyToOne(targetEntity: Proprietaire::class, inversedBy: 'comptabilites')]
    #[ORM\JoinColumn(name: "idProprio", referencedColumnName: "id", onDelete: "CASCADE")]
    private ?Proprietaire $proprio = null;

    #[ORM\ManyToOne(targetEntity: Tarif::class, inversedBy: 'comptabilites')]
    #[ORM\JoinColumn(referencedColumnName: "id_tarif", nullable: false)]
    private ?Tarif $tarif = null;

    #[ORM\ManyToOne(targetEntity: Paiement::class, inversedBy: 'comptabilites')]
    #[ORM\JoinColumn(referencedColumnName: "id_paiement", nullable: true)]
    private ?Paiement $paiement = null;


    #[ORM\OneToMany(mappedBy: 'comptabilite', targetEntity: Occupation::class, orphanRemoval: true, cascade: ['remove'])]
    private Collection $occupations;

    public function __construct()
    {
        $this->occupations = new ArrayCollection();
    }

public function getOccupations(): Collection
{
    return $this->occupations;
}

public function addOccupation(Occupation $occupation): static
{
    if (!$this->occupations->contains($occupation)) {
        $this->occupations[] = $occupation;
        $occupation->setCompta($this);
    }

    return $this;
}

public function removeOccupation(Occupation $occupation): static
{
    if ($this->occupations->removeElement($occupation)) {
        // set the owning side to null (unless already changed)
        if ($occupation->getCompta() === $this) {
            $occupation->setCompta(null);
        }
    }

    return $this;
}


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombreChien(): ?int
    {
        return $this->nombreChien;
    }

    public function setNombreChien(int $nombreChien): static
    {
        $this->nombreChien = $nombreChien;

        return $this;
    }

    public function getNombreBox(): ?int
    {
        return $this->nombreBox;
    }

    public function setNombreBox(int $nombreBox): static
    {
        $this->nombreBox = $nombreBox;

        return $this;
    }

    public function getDateArrivee(): ?\DateTimeInterface
    {
        return $this->dateArrivee;
    }

    public function setDateArrivee(\DateTimeInterface $dateArrivee): static
    {
        $this->dateArrivee = $dateArrivee;

        return $this;
    }

    public function getDateDepart(): ?\DateTimeInterface
    {
        return $this->dateDepart;
    }

    public function setDateDepart(\DateTimeInterface $dateDepart): static
    {
        $this->dateDepart = $dateDepart;

        return $this;
    }

    public function getMontantTotal(): ?string
    {
        return $this->montantTotal;
    }

    public function setMontantTotal(string $montantTotal): static
    {
        $this->montantTotal = $montantTotal;

        return $this;
    }

    public function getCommentaires(): ?string
    {
        return $this->commentaires;
    }

    public function setCommentaires(?string $commentaires): static
    {
        $this->commentaires = $commentaires;

        return $this;
    }

    public function getProprio(): ?Proprietaire
    {
        return $this->proprio;
    }

    public function setProprio(Proprietaire $proprio): static
    {
        $this->proprio = $proprio;

        return $this;
    }

    public function getTarif(): ?Tarif
    {
        return $this->tarif;
    }

    public function setTarif(Tarif $tarif): static
    {
        $this->tarif = $tarif;

        return $this;
    }

    public function getPaiement(): ?Paiement
    {
        return $this->paiement;
    }

    public function setPaiement(Paiement $paiement): static
    {
        $this->paiement = $paiement;

        return $this;
    }
}
 