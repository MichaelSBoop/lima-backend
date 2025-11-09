package oauth

type Config struct {
	ClientID       string          `json:"client_id" yaml:"client_id"`
	ClientSecret   string          `json:"client_secret" yaml:"client_secret"`
	OauthProviders []OauthProvider `json:"oauth_providers" yaml:"oauth_providers"`
}

type OauthProvider struct {
	Name    string `json:"name" yaml:"name"`
	BaseURL string `json:"base_url" yaml:"base_url"`
}
