# IOCP(Input Output Completion Port)

- IOCP 관찰해야 하는 관점
  1. 입출력은 넌-블로킹 모드로 동작하는가?
  2. 넌-블로킹 모드로 진행된 입출력의 완료는 어떻게 확인하는가?
- IOCP에서는 완료된 IO정보가 Completion Port(CP 오브젝트)라는 커널 오브젝트에 등록된다. 그냥 등록되는 것이 아니므로 '소켓과 CP 오브젝트와의 연결 요청'이 선행되어야 한다.
- IOCP 모델의 서버 구현을 위해서는 두 가지 일이 진행되어야 한다.
  1. CP 오브젝트의 생성
  2. CP 오브젝트와 소켓의 연결

### 1. Completion Port 생성

- 소켓은 반드시 Overlapped 속성이 부여된 소켓이어야 한다

### 2. Completion Port 오브젝트와 소켓의 연결

### 3. Completion Port의 완료된 IO 확인과 쓰레드의 IO처리

### 4. Completion Port의 완료된 IO 확인과 쓰레드의 IO 처리



