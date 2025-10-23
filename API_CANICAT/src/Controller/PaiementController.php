<?php

namespace App\Controller;

use App\Entity\Paiement;
use App\Form\PaiementType;
use App\Repository\PaiementRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/Paiement')]
class PaiementController extends AbstractController
{
    protected function FormaEnvoie($data, array $fields): array
    {
        if ($data === null) {
            return [];
        }

        $formatted = [];
        foreach ($fields as $field) {
            $getter = 'get' . ucfirst($field);
            if (method_exists($data, $getter)) {
                $formatted[$field] = $data->$getter();
            }
        }
        return $formatted;
    }
    #[Route('/', name: 'paiement_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): Response
    {
        $Box = $em->getRepository(Paiement::class)->findAll();

        return new JsonResponse(array_map(fn($Box) => $this->FormaEnvoie($Box, fields:['id', 'type']), $Box));
    }

    #[Route('/new', name: 'paiement_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $Paiement = new Paiement();
        $form = $this->createForm(PaiementType::class, $Paiement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($Paiement);
            $entityManager->flush();

            return $this->redirectToRoute('home');
        }

        return $this->render('Paiement/new.html.twig', [
            'paiement' => $Paiement,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}', name: 'paiement_show', methods: ['GET'])]
    public function show(Paiement $Paiement): Response
    {
        return $this->render('Paiement/show.html.twig', [
            'paiement' => $Paiement,
        ]);
    }

    #[Route('/{id}/edit', name: 'paiement_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Paiement $Paiement, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(PaiementType::class, $Paiement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            return $this->redirectToRoute('home');
        }

        return $this->render('Paiement/edit.html.twig', [
            'paiement' => $Paiement,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}', name: 'paiement_delete', methods: ['POST'])]
    public function delete(Request $request, Paiement $Paiement, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$Paiement->getId(), $request->request->get('_token'))) {
            $entityManager->remove($Paiement);
            $entityManager->flush();
        }

        return $this->redirectToRoute('home');
    }
}
