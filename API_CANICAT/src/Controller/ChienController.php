<?php

namespace App\Controller;

use App\Entity\Chien;
use App\Entity\Occupation;
use App\Form\ChienType;
use App\Entity\Proprietaire;
use App\Repository\ChienRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/chien')]
class ChienController extends AbstractController
{
    private function formatChien(Chien $chien): array
{
    $proprio = $chien->getProprio()->getNom() . " " . $chien->getProprio()->getPrenom();
    return [
        'id' => $chien->getId(),
        'nomChien' => $chien->getNomChien(),
        'proprio' => $proprio,
    ];
}
private function setChien(Chien $chien, array $data, EntityManagerInterface $entityManager): void
{
    if (isset($data['nomChien'])) {
        $chien->setNomChien($data['nomChien']);
    }

    if (isset($data['proprio'])) {
        $proprio = $entityManager->getRepository(Proprietaire::class)->find($data['proprio']);
        $chien->setProprio($proprio);
    }
}

    #[Route('/', name: 'chien_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
{
    $Chiens = $em->getRepository(Chien::class)->findAll();

    // Transformer chaque Chien en tableau
    $formattedChiens = array_map(fn($Chien) => $this->formatChien($Chien), $Chiens);

    return new JsonResponse($formattedChiens);
}

    #[Route('/new', name: 'chien_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $Chien = new Chien();
        $this->setChien($Chien, $data, $entityManager);
        $entityManager->persist($Chien);
        $entityManager->flush();

        return new JsonResponse(['message' => 'ok'], 201);
        

    }

    #[Route('/{id}', name: 'chien_show', methods: ['GET'])]
    public function show(Chien $chien): Response
    {
        return $this->render('chien/show.html.twig', [
            'chien' => $chien,
        ]);
    }

    #[Route('/{id}/edit', name: 'chien_edit', methods: [ 'POST'])]
    public function edit(Request $request, EntityManagerInterface $entityManager,int $id): Response
    {
        $data = json_decode($request->getContent(), true);
        $Chien = $entityManager->find(Chien::class, $id);
        if (!$Chien) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }
        $this->setChien($Chien, $data, $entityManager);
        $entityManager->persist($Chien);
        $entityManager->flush();
        return new JsonResponse(['message' => 'ok'], 201);
    }

    #[Route('/{id}/delete', name: 'chien_delete', methods: ['DELETE'])]
    public function delete($id, EntityManagerInterface $entityManager): Response
    {
        $comptabilite = $entityManager->find(Chien::class, $id);
        if (!$comptabilite) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }

        $occupations = $entityManager->getRepository(Occupation::class)->findBy(['chien' => $id]);
        foreach ($occupations as $occup) {
            $entityManager->remove($occup);
        }

        // Supprimer la comptabilité après avoir supprimé les occupations
        $entityManager->remove($comptabilite);
        $entityManager->flush();

        return new JsonResponse(['message' => 'ok'], 201);
    }
}
