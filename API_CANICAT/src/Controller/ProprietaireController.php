<?php

namespace App\Controller;

use App\Entity\Chien;
use App\Entity\Proprietaire;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/proprietaire')]
class ProprietaireController extends AbstractController
{
    private function formatProprietaire(Proprietaire $proprietaire): array
    {
        return [
            'id' => $proprietaire->getIdProprio(), // Utilisation de getIdProprio
            'nom' => $proprietaire->getNom(),
            'prenom' => $proprietaire->getPrenom(),
            'contact' => $proprietaire->getContact(),
        ];
    }

    private function setProprietaire(Proprietaire $proprietaire, array $data): void
    {
        if (isset($data['nom'])) {
            $proprietaire->setNom($data['nom']);
        }

        if (isset($data['prenom'])) {
            $proprietaire->setPrenom($data['prenom']);
        }

        if (isset($data['contact'])) {
            $proprietaire->setContact($data['contact']);
        }
    }

    #[Route('/', name: 'proprietaire_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $proprietaires = $em->getRepository(Proprietaire::class)->findAll();
    
        // Transformer chaque Proprietaire en tableau
        $formattedProprietaires = array_map(fn($proprietaire) => $this->formatProprietaire($proprietaire), $proprietaires);
    
        return new JsonResponse($formattedProprietaires);
    }

    #[Route('/new', name: 'proprietaire_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $proprietaire = new Proprietaire();
        $this->setProprietaire($proprietaire, $data);
        $entityManager->persist($proprietaire);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Propriétaire créé avec succès', 'id' => $proprietaire->getIdProprio()], 201);
    }

    #[Route('/{id}', name: 'proprietaire_show', methods: ['GET'])]
    public function show(Proprietaire $proprietaire): JsonResponse
    {
        return new JsonResponse($this->formatProprietaire($proprietaire));
    }

    #[Route('/{id}/edit', name: 'proprietaire_edit', methods: ['PUT'])]
    public function edit(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $proprietaire = $entityManager->find(Proprietaire::class, $id);
        if (!$proprietaire) {
            return new JsonResponse(['error' => 'Propriétaire non trouvé'], 404);
        }
        $this->setProprietaire($proprietaire, $data);
        $entityManager->persist($proprietaire);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Propriétaire mis à jour avec succès'], 200);
    }

    #[Route('/{id}/delete', name: 'proprietaire_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $proprietaire = $entityManager->find(Proprietaire::class, $id);
        if (!$proprietaire) {
            return new JsonResponse(['error' => 'Propriétaire non trouvé'], 404);
        }

        // Supprimer les chiens associés
        foreach ($proprietaire->getChiens() as $chien) {
            $entityManager->remove($chien);
        }

        // Supprimer le propriétaire
        $entityManager->remove($proprietaire);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Propriétaire supprimé avec succès'], 201);
    }
}

