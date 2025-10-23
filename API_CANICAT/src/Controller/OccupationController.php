<?php

namespace App\Controller;

use App\Entity\Box;
use App\Entity\Chien;
use App\Entity\Occupation;
use App\Entity\Comptabilite;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/Occupation')]
class OccupationController extends AbstractController
{
    private function formatOccupation(Occupation $occupation): array
    {
        return [
            'id' => $occupation->getId(),
            'dateArrive' => $occupation->getCompta()->getDateArrivee()?->format('Y-m-d'),
            'dateDepart' => $occupation->getCompta()->getDateDepart()?->format('Y-m-d'),
            'tarif' => $occupation->getCompta()->getTarif()->getMontant(),
            'nomChien' => $occupation->getChien()->getNomChien(),
            'box' => $occupation->getBox()->getId(),
            'idCompta' => $occupation->getCompta()->getId(),
        ];
    }

    private function setOccupation(Occupation $occupation, array $data, EntityManagerInterface $entityManager): void
    {
        if (isset($data['compta'])) {
            $comptabilite = $entityManager->getRepository(Comptabilite::class)->find($data['compta']);
            $occupation->setCompta($comptabilite);
        }

        if (isset($data['chien'])) {
            $chien = $entityManager->getRepository(Chien::class)->find($data['chien']);
            $occupation->setChien($chien);
        }

        if (isset($data['box'])) {
            $box = $entityManager->getRepository(Box::class)->find($data['box']);
            $occupation->setBox($box);
        }
    }

    #[Route('/', name: 'occupation_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $occupations = $em->getRepository(Occupation::class)->findAll();

        // Transformer chaque occupation en tableau
        $formattedOccupations = array_map(fn($occupation) => $this->formatOccupation($occupation), $occupations);

        return new JsonResponse($formattedOccupations);
    }

    #[Route('/new', name: 'occupation_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $occupation = new Occupation();
        $this->setOccupation($occupation, $data, $entityManager);
        $entityManager->persist($occupation);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Occupation créée avec succès', 'id' => $occupation->getId()], 201);
    }

    #[Route('/{id}', name: 'occupation_show', methods: ['GET'])]
    public function show(Occupation $occupation): JsonResponse
    {
        return new JsonResponse($this->formatOccupation($occupation));
    }

    #[Route('/{id}/edit', name: 'occupation_edit', methods: ['PUT'])]
    public function edit(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $occupation = $entityManager->find(Occupation::class, $id);
        if (!$occupation) {
            return new JsonResponse(['error' => 'Occupation non trouvée'], 404);
        }
        $this->setOccupation($occupation, $data, $entityManager);
        $entityManager->persist($occupation);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Occupation mise à jour avec succès'], 200);
    }

    #[Route('/{id}/delete', name: 'occupation_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $occupation = $entityManager->find(Occupation::class, $id);
        if (!$occupation) {
            return new JsonResponse(['error' => 'Occupation non trouvée'], 404);
        }

        $entityManager->remove($occupation);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Occupation supprimée avec succès'], 201);
    }
}
