<?php
namespace App\Service;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SupabaseClient
{
    private string $url;
    private string $apiKey;
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient, string $url, string $apiKey)
    {
        $this->httpClient = $httpClient;
        $this->url = rtrim($url, '/');
        $this->apiKey = $apiKey;
    }

    public function get(string $table, array $filters = []): array
    {
        $query = http_build_query($filters);
        $response = $this->httpClient->request('GET', "{$this->url}/rest/v1/{$table}?" . $query, [
            'headers' => [
                'apikey' => $this->apiKey,
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
        ]);

        return $response->toArray();
    }

    public function insert(string $table, array $data): array
    {
        $response = $this->httpClient->request('POST', "{$this->url}/rest/v1/{$table}", [
            'headers' => [
                'apikey' => $this->apiKey,
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Prefer' => 'return=representation',
            ],
            'json' => $data,
        ]);

        return $response->toArray();
    }
}
?>