<?php

namespace App\Controller;

use App\Entity\Box;
use App\Form\BoxType;
use App\Repository\BoxRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/box')]
class BoxController extends AbstractController
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

    #[Route('/', name: 'box_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): Response
    {
        $Box = $em->getRepository(Box::class)->findAll();

        return new JsonResponse(array_map(fn($Box) => $this->FormaEnvoie($Box, fields:['id', 'couleur', 'nom']), $Box));
    }

    #[Route('/new', name: 'box_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $box = new Box();
        $form = $this->createForm(BoxType::class, $box);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($box);
            $entityManager->flush();

            return $this->redirectToRoute('box_index');
        }

        return $this->render('box/new.html.twig', [
            'box' => $box,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}', name: 'box_show', methods: ['GET'])]
    public function show(Box $box): Response
    {
        return $this->render('box/show.html.twig', [
            'box' => $box,
        ]);
    }

    #[Route('/{id}/edit', name: 'box_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Box $box, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(BoxType::class, $box);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();
            return $this->redirectToRoute('box_index');
        }

        return $this->render('box/edit.html.twig', [
            'box' => $box,
            'form' => $form->createView(),
        ]);
    }

    #[Route('/{id}', name: 'box_delete', methods: ['POST'])]
    public function delete(Request $request, Box $box, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$box->getId(), $request->request->get('_token'))) {
            $entityManager->remove($box);
            $entityManager->flush();
        }

        return $this->redirectToRoute('box_index');
    }
}
