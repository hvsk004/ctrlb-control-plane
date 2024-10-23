
## Agent Executible

**Version:** Linux/x86_64

### Executible build
We need CtrlB's custom Fluent-bit for building the Agent executible.
```bash
  git clone https://github.com/ctrlb-hq/ctrlb-fluent-bit.git
  cd ctrlb-fluent-bit
  mkdir build && cd build
```
Following commands shall build the Fluent-bit libraries
```bash
cmake \
  -DFLB_RELEASE=On \
  -DFLB_TRACE=Off \
  -DFLB_CONFIG_YAML=ON \
  -DFLB_JEMALLOC=Off \
  -DFLB_TLS=On \
  -DFLB_SHARED_LIB=On \
  -DFLB_EXAMPLES=Off \
  -DFLB_HTTP_SERVER=On \
  -DFLB_IN_SYSTEMD=On \
  -DFLB_OUT_KAFKA=On \
  -DFLB_ALL=On \
  ../

make
```
After building the custom fluent-bit client, we can build the agent executible
```bash
go build cmd/ctrlb_collector/main.go 
```

### Executible Run
We need to export the path to the `libfluent-bit.so` file before running the agent.
```bash
export LD_LIBRARY_PATH=/ctrlb-fluent-bit/build/lib
./agent
```
