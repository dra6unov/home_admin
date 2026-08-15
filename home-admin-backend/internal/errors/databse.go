package custom_errors

import "errors"

var (
	ErrEntityNotFound = errors.New("not found")
)
