package inmem

type Config struct {
	InitialCapacity int `json:"initial_capacity" yaml:"initial_capacity"`
	MaximumSize     int `json:"maximum_size" yaml:"maximum_size"`
}
