package assets

import (
	"embed"
)

//go:embed schemas/*
var Schemas embed.FS
