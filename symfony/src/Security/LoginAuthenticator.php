<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\{
    Response,
    Request,
    RedirectResponse
};
use Symfony\Component\Security\{
    Core\Security,
    Core\Authentication\Token\TokenInterface
};
use Symfony\Component\Security\Http\{
    Authenticator\Passport\Badge\UserBadge,
    Authenticator\Passport\Badge\CsrfTokenBadge,
    Authenticator\Passport\Badge\RememberMeBadge,
    Authenticator\AbstractLoginFormAuthenticator,
    Authenticator\Passport\Credentials\PasswordCredentials,
    Authenticator\Passport\Passport,
    Util\TargetPathTrait,
};
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;


class LoginAuthenticator extends AbstractLoginFormAuthenticator
{
    use TargetPathTrait;

    public const LOGIN_ROUTE = 'app_login';

    private UrlGeneratorInterface $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }

    public function authenticate(Request $request): Passport
    {
        // $this->saveTargetPath($request->getSession(), $request->getUri(), 'main');
        // dd($request->getSession(), $request->getUri());
        $email = $request->request->get('email', '');

        $request->getSession()->set(Security::LAST_USERNAME, $email);
        // dd($this->getTargetPath($request->getSession(), 'main'));

        return new Passport(
            new UserBadge($email),
            new PasswordCredentials($request->request->get('password', '')),
            [
                new CsrfTokenBadge('authenticate', $request->request->get('_csrf_token')),
                new RememberMeBadge(),
            ]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // dd($request->getSession()->all());
        $targetPath = $this->getTargetPath($request->getSession(), $firewallName);
        
        if (!$targetPath) {
            $targetPath = $this->urlGenerator->generate('home');
            // return new RedirectResponse($this->urlGenerator->generate('home'));
           
        }
        return new RedirectResponse($targetPath);
        
        // throw new \Exception('TODO: provide a valid redirect inside '.__FILE__);
    }
    
    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }

}
