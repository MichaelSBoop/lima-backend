package domain

type Account struct {
	AccountID   string `json:"accountId" yaml:"account_id"`
	Currency    string `json:"currency" yaml:"currency"`
	AccountType string `json:"accountType" yaml:"account_type"`
	Nickname    string `json:"nickname" yaml:"nickname"`
	Servicer    string `json:"servicer" yaml:"servicer"`
}
