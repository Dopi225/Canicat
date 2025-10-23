<?php


namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\InMemoryUserProvider;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;

class CustomAuthenticator extends AbstractAuthenticator
{
    public function supports(Request $request): bool
    {
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): Passport
{
    $authorizationHeader = $request->headers->get('Authorization');

    if (!$authorizationHeader || !preg_match('/Basic\s+(.*)$/i', $authorizationHeader, $matches)) {
        throw new UnauthorizedHttpException('Basic', 'Missing or invalid Authorization header');
    }

    [$username, $password] = explode(':', base64_decode($matches[1]), 2);

    $userProvider = new InMemoryUserProvider([
        'admin' => [
            'password' => '$2y$10$aq3k2KK2.LaLGQcFPR.Ed.j8ZK6YgjQjfjYTrq32ZqJ5exqbeWmHq', // admin haché
            'roles' => ['ROLE_ADMIN']
        ],
    ]);

    $user = $userProvider->loadUserByIdentifier($username);

    if (!$user || !password_verify($password, $user->getPassword())) {
        throw new BadCredentialsException('Invalid username or password');
    }

    return new Passport(
        new UserBadge($username),
        new PasswordCredentials($password)
    );
}

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null; // Laisser continuer la requête
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        return new Response('Unauthorized', Response::HTTP_UNAUTHORIZED);
    }
}
