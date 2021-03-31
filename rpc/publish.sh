set -e
if [[ "$#" -ne 1 ]]; then
  echo "Usage: $0 VERSION" >&2
  exit 1
fi

npm version "$1"
npm publish --access public
