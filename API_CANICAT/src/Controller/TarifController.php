<?php

namespace App\Controller;

use App\Entity\Tarif;
use App\Form\TarifType;
use App\Repository\TarifRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/tarif')]
class TarifController extends AbstractController
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
    #[Route('/', name: 'tarif_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): Response
    {
        $Box = $em->getRepository(Tarif::class)->findAll();

        return new JsonResponse(array_map(fn($Box) => $this->FormaEnvoie($Box, fields:['id', 'libelle', 'montant']), $Box));
    }

    #[Route('/new', name: 'tarif_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $tarif = new Tarif();
        $form = $this->createForm(TarifType::class, $tarif);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($tarif);
            $entityManager->flush();

            return $this->redirectToRoute('tarif_index');
        }

        return $this->render('tarif/new.html.twig', [
            'tarif' => $tarif,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}', name: 'tarif_show', methods: ['GET'])]
    public function show(Tarif $tarif): Response
    {
        return $this->render('tarif/show.html.twig', [
            'tarif' => $tarif,
        ]);
    }

    #[Route('/{id}/edit', name: 'tarif_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Tarif $tarif, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(TarifType::class, $tarif);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            return $this->redirectToRoute('tarif_index');
        }

        return $this->render('tarif/edit.html.twig', [
            'tarif' => $tarif,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}', name: 'tarif_delete', methods: ['POST'])]
    public function delete(Request $request, Tarif $tarif, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$tarif->getId(), $request->request->get('_token'))) {
            $entityManager->remove($tarif);
            $entityManager->flush();
        }

        return $this->redirectToRoute('tarif_index');
    }
}
