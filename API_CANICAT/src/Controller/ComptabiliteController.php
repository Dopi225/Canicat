<?php

namespace App\Controller;

use App\Entity\Tarif;
use App\Entity\Paiement;
use App\Entity\Occupation;
use App\Entity\Comptabilite;
use App\Entity\Proprietaire;
use App\Form\ComptabiliteType;
use App\Repository\OccupationRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\ComptabiliteRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/comptabilite')]
class ComptabiliteController extends AbstractController
{
    private function formatComptabilite(Comptabilite $comptabilite): array
{
    $proprio = $comptabilite->getProprio()->getNom() . " " . $comptabilite->getProprio()->getPrenom();
    $paiement = "";

    if ($comptabilite->getPaiement()) {
        $paiement =  $comptabilite->getPaiement()->getType();
    }
    return [
        'id' => $comptabilite->getId(),
        'nombreChien' => $comptabilite->getNombreChien(),
        'nombreBox' => $comptabilite->getNombreBox(),
        'dateArrivee' => $comptabilite->getDateArrivee()?->format('Y-m-d'),
        'dateDepart' => $comptabilite->getDateDepart()?->format('Y-m-d'),
        'montantTotal' => $comptabilite->getMontantTotal(),
        'commentaires' => $comptabilite->getCommentaires(),
        'proprio' => $proprio,
        'tarif' => $comptabilite->getTarif()->getLibelle(),
        'paiement' => $paiement,
        
    ];
}
private function setComptabilite(Comptabilite $comptabilite, array $data, EntityManagerInterface $entityManager): void
{
    // Vérifie si 'nombreChien' existe dans le tableau et n'est pas vide
    if (isset($data['nombreChien']) && !empty($data['nombreChien'])) {
        $comptabilite->setNombreChien(intval($data['nombreChien']));  // Convertir en entier
    } 

    // Traiter les autres champs de la même manière
    if (isset($data['nombreBox']) && !empty($data['nombreBox'])) {
        $comptabilite->setNombreBox(intval($data['nombreBox']));  // Convertir en entier si nécessaire
    }

    if (isset($data['dateArrivee']) && !empty($data['dateArrivee'])) {
        $comptabilite->setDateArrivee(new \DateTime($data['dateArrivee']));
    }

    if (isset($data['dateDepart']) && !empty($data['dateDepart'])) {
        $comptabilite->setDateDepart(new \DateTime($data['dateDepart']));
    }

    if (isset($data['montantTotal']) && !empty($data['montantTotal'])) {
        $comptabilite->setMontantTotal(floatval($data['montantTotal']));  // Convertir en float si nécessaire
    }

    if (isset($data['commentaires'])) {
        $comptabilite->setCommentaires($data['commentaires']);
    }

    if (isset($data['proprio']) && !empty($data['proprio'])) {
        $proprio = $entityManager->getRepository(Proprietaire::class)->find($data['proprio']);
        $comptabilite->setProprio($proprio);
    }

    if (isset($data['tarif']) && !empty($data['tarif'])) {
    $tarif = $entityManager->getRepository(Tarif::class)->findOneBy(["libelle" => $data['tarif']]);
    if ($tarif) {
        $comptabilite->setTarif($tarif);
    } else {
        // Optionnel : gérer le cas où le tarif n'existe pas
        throw new \Exception("Tarif '{$data['tarif']}' introuvable.");
    }
}


    if (isset($data['paiement']) && !empty($data['paiement'])) {
        $paiement = $entityManager->getRepository(Paiement::class)->find($data['paiement']);
        $comptabilite->setPaiement($paiement);
    }
}
private function setEditComptabilite(Comptabilite $comptabilite, array $data, EntityManagerInterface $entityManager): void
{
    if (isset($data['dateArrivee']) && !empty($data['dateArrivee'])) {
        $comptabilite->setDateArrivee(new \DateTime($data['dateArrivee']));
    }

    if (isset($data['dateDepart']) && !empty($data['dateDepart'])) {
        $comptabilite->setDateDepart(new \DateTime($data['dateDepart']));
    }

    if (isset($data['montantTotal']) && !empty($data['montantTotal'])) {
        $comptabilite->setMontantTotal(floatval($data['montantTotal']));  // Convertir en float si nécessaire
    }

    if (isset($data['paiement']) && !empty($data['paiement'])) {
        $paiement = $entityManager->getRepository(Paiement::class)->find($data['paiement']);
        
        // Vérifiez si le paiement existe avant de le définir
        if ($paiement !== null) {
            $comptabilite->setPaiement($paiement);
        }
    }
}



    #[Route('/', name: 'comptabilite_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
{
    $Comptabilites = $em->getRepository(Comptabilite::class)->findAll();

    // Transformer chaque Comptabilite en tableau
    $formattedComptabilites = array_map(fn($Comptabilite) => $this->formatComptabilite($Comptabilite), $Comptabilites);

    return new JsonResponse($formattedComptabilites);
}
 
    #[Route('/new', name: 'comptabilite_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
{
    // Récupère le contenu de la requête (le JSON brut)
    $jsonContent = $request->getContent();
    
    // Décode ce JSON pour l'utiliser sous forme de tableau PHP
    $data = json_decode($jsonContent, true);

    // Log pour vérifier les données reçues
    // dump($data); // Utilise dump() pour déboguer

    $Comptabilite = new Comptabilite();
    $this->setComptabilite($Comptabilite, $data, $entityManager);
    $entityManager->persist($Comptabilite);
    $entityManager->flush();

    return new JsonResponse(['message' => 'ok', 'id' => $Comptabilite->getId()], 201);
}


    #[Route('/{id}', name: 'comptabilite_show', methods: ['GET'])]
    public function show(Comptabilite $comptabilite): Response
    {
        return $this->render('Comptabilite/show.html.twig', [
            'comptabilite' => $comptabilite,
        ]);
    }

    #[Route('/{id}/edit', name: 'comptabilite_edit', methods: ['POST'])]
    public function edit(Request $request, $id, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $Comptabilite = $entityManager->find(Comptabilite::class, $id);
        if (!$Comptabilite) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }
        $this->setEditComptabilite($Comptabilite, $data, $entityManager);
        $entityManager->persist($Comptabilite);
        $entityManager->flush();
        return new JsonResponse(['message' => 'ok'], 201);
    }

    #[Route('/{id}/delete', name: 'comptabilite_delete', methods: ['DELETE'])]
    public function delete($id, EntityManagerInterface $entityManager): Response
    {
        $entityManager->beginTransaction();
    
        try {
            $comptabilite = $entityManager->find(Comptabilite::class, $id);
    
            if (!$comptabilite) {
                return new JsonResponse(['error' => 'Not found'], 404);
            }
    
            // Manually remove all related Occupations
            $occupations = $entityManager->getRepository(Occupation::class)->findBy(['comptabilite' => $comptabilite]);
    
            foreach ($occupations as $occupation) {
                $comptabilite->removeOccupation($occupation);
            }
    
            // Now remove the Comptabilite
            $entityManager->remove($comptabilite);
            $entityManager->flush();
            $entityManager->commit();
    
            return new JsonResponse(['message' => 'ok'], 201);
        } catch (\Exception $e) {
            $entityManager->rollback();
            return new JsonResponse(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
    


}
