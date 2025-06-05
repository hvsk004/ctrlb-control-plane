package utils

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"strings"
	"time"
	"unicode"
)

func ToCamelCase(input string) string {
	words := strings.Fields(input) // splits on any whitespace
	if len(words) == 0 {
		return ""
	}

	// lowercase first word
	result := strings.ToLower(words[0])

	// capitalize the rest
	for _, word := range words[1:] {
		runes := []rune(word)
		if len(runes) > 0 {
			runes[0] = unicode.ToUpper(runes[0])
		}
		result += string(runes)
	}
	return result
}

func TrimAfterUnderscore(s string) string {
	if idx := strings.Index(s, "_"); idx != -1 {
		return s[:idx]
	}
	return s
}

func GetCurrentTime() int64 {
	return time.Now().Unix()
}
func HashFromConfig(config map[string]any) string {
	bytes, err := json.Marshal(config)
	if err != nil {
		panic("failed to marshal config for hashing: " + err.Error())
	}
	sum := sha1.Sum(bytes)
	return hex.EncodeToString(sum[:])[:8]
}
