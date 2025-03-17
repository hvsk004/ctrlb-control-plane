interface AgentType{
    label: string;
    value: string;
}
export const AgentsType:AgentType[] = [
    { label: "Docker", value: "docker pull ubuntu:latest\ndocker run -it ubuntu:latest /bin/bash\ndocker ps -a\ndocker tag my-image:latest my-repo/my-image:latest" },
    { label: "Kubernetes", value: "kubectl apply -f my-deployment.yaml\nkubectl get pods\nkubectl logs my-pod\nkubectl get deployments" },
    { label: "Helm", value: "helm repo add my-repo https://example.com/charts\nhelm install my-release my-repo/my-chart\nhelm list\nhelm --version" },
    { label: "Linux", value: "sudo apt update\nsudo apt install my-package\nsystemctl status my-service\nsudo apt upgrade" },
    { label: "Windows", value: "choco install my-package\nStart-Service -Name 'MyService'\nGet-Service -Name 'MyService'\nchoco --version" },
    { label: "MacOS", value: "brew update\nbrew install my-package\nbrew services start my-package\nbre --version" }
]