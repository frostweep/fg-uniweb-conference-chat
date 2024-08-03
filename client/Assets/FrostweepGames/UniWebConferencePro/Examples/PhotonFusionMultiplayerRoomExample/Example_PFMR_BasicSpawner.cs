#if FUSION_WEAVER
using Fusion;
using Fusion.Sockets;
#endif
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace FrostweepGames.UniWebConferencePro
{
    public class Example_PFMR_BasicSpawner : MonoBehaviour
#if FUSION_WEAVER
        , INetworkRunnerCallbacks
#endif
    {
#if FUSION_WEAVER
        private NetworkRunner _runner;

        [SerializeField] 
        private NetworkPrefabRef _playerPrefab;

        private List<NetworkTarget> _spawnedCharacters = new List<NetworkTarget>();

        // voice chat
        private List<UniWebConference.User> _connectedUsers = new List<UniWebConference.User>();
        private bool _beganStreamAfterConnection;
        private string _playerName;
        private bool _isMuted = false;

        public void OnPlayerJoined(NetworkRunner runner, PlayerRef player)
        {
            // Create a unique position for the player
            Vector3 spawnPosition = new Vector3((player.RawEncoded % runner.Config.Simulation.DefaultPlayers) * 3, 1, 0);
            NetworkObject networkPlayerObject = runner.Spawn(_playerPrefab, spawnPosition, Quaternion.identity, player);
            // Keep track of the player avatars so we can remove it when they disconnect
            _spawnedCharacters.Add(new NetworkTarget(networkPlayerObject)
            {
                userId = runner.UserId,
                playerRef = player
            });

            if (IsMainPlayer(runner))
            {
                _playerName = runner.GetPlayerUserId(player);
                ConnectUserToVoiceChat();
            }
        }

        public void OnPlayerLeft(NetworkRunner runner, PlayerRef player) 
        {
            // Find and remove the players avatar

            var pl = _spawnedCharacters.Find(it => it.playerRef == player);

            if (pl != null)
            {
                runner.Despawn(pl.networkObject);
                _spawnedCharacters.Remove(pl);

                if (IsMainPlayer(runner))
                {
                    DisconnectUserFromVoiceChat();
                }
            }
        }

        public void OnInput(NetworkRunner runner, NetworkInput input)
        {
            if (IsMainPlayer(runner))
            {
                var data = new NetworkInputData();

                if (Input.GetKey(KeyCode.W))
                    data.direction += Vector3.forward;

                if (Input.GetKey(KeyCode.S))
                    data.direction += Vector3.back;

                if (Input.GetKey(KeyCode.A))
                    data.direction += Vector3.left;

                if (Input.GetKey(KeyCode.D))
                    data.direction += Vector3.right;

                input.Set(data);
            }
        }

        public void OnInputMissing(NetworkRunner runner, PlayerRef player, NetworkInput input) { }
        public void OnShutdown(NetworkRunner runner, ShutdownReason shutdownReason) { }
        public void OnConnectedToServer(NetworkRunner runner) 
        {
            UniWebConference.Instance.UserConnectedEvent += UserConnectedEventHandler;
            UniWebConference.Instance.UserDisconnectedEvent += UserDisconnectedEventHandler;
            UniWebConference.Instance.ChannelJoinedEvent += ChannelJoinedEventHandler;
            UniWebConference.Instance.ChannelJoinFailedEvent += ChannelJoinFailedEventHandler;
            UniWebConference.Instance.ChannelLeftEvent += ChannelLeftEventHandler;
            UniWebConference.Instance.ConnectFailedEvent += ConnectFailedEventHandler;
            UniWebConference.Instance.ConnectedEvent += ConnectedEventHandler;
            UniWebConference.Instance.DisconnectedEvent += DisconnectedEventEventHandler;
            UniWebConference.Instance.StreamBeganEvent += StreamBeganEventHandler;
            UniWebConference.Instance.StreamFailedEvent += StreamFailedEventHandler;
        }

        public void OnDisconnectedFromServer(NetworkRunner runner) 
        {
            UniWebConference.Instance.UserConnectedEvent -= UserConnectedEventHandler;
            UniWebConference.Instance.UserDisconnectedEvent -= UserDisconnectedEventHandler;
            UniWebConference.Instance.ChannelJoinedEvent -= ChannelJoinedEventHandler;
            UniWebConference.Instance.ChannelJoinFailedEvent -= ChannelJoinFailedEventHandler;
            UniWebConference.Instance.ChannelLeftEvent -= ChannelLeftEventHandler;
            UniWebConference.Instance.ConnectFailedEvent -= ConnectFailedEventHandler;
            UniWebConference.Instance.ConnectedEvent -= ConnectedEventHandler;
            UniWebConference.Instance.DisconnectedEvent -= DisconnectedEventEventHandler;
            UniWebConference.Instance.StreamBeganEvent -= StreamBeganEventHandler;
            UniWebConference.Instance.StreamFailedEvent -= StreamFailedEventHandler;
        }

        public void OnConnectRequest(NetworkRunner runner, NetworkRunnerCallbackArgs.ConnectRequest request, byte[] token) { }
        public void OnConnectFailed(NetworkRunner runner, NetAddress remoteAddress, NetConnectFailedReason reason) { }
        public void OnUserSimulationMessage(NetworkRunner runner, SimulationMessagePtr message) { }
        public void OnSessionListUpdated(NetworkRunner runner, List<SessionInfo> sessionList) { }
        public void OnCustomAuthenticationResponse(NetworkRunner runner, Dictionary<string, object> data) { }
        public void OnHostMigration(NetworkRunner runner, HostMigrationToken hostMigrationToken) { }
        public void OnReliableDataReceived(NetworkRunner runner, PlayerRef player, ArraySegment<byte> data) { }
        public void OnSceneLoadDone(NetworkRunner runner) { }
        public void OnSceneLoadStart(NetworkRunner runner) { }

        public bool IsMainPlayer(NetworkRunner runner)
        {
            return _runner.UserId == runner.UserId;
        }

        public NetworkObject GetNetworkObjectByUserId(string userId)
        {
            return _spawnedCharacters.Find(it => it.userId == userId).networkObject;
        }

        async void StartGame(GameMode mode)
        {
            // Create the Fusion runner and let it know that we will be providing user input
            _runner = gameObject.AddComponent<NetworkRunner>();
            _runner.ProvideInput = true;

            // Start or join (depends on gamemode) a session with a specific name
            await _runner.StartGame(new StartGameArgs()
            {
                GameMode = mode,
                SessionName = "TestRoom",
                Scene = SceneManager.GetActiveScene().buildIndex,
                SceneManager = gameObject.AddComponent<NetworkSceneManagerDefault>()
            });
        }

        private void OnGUI()
        {
            if (_runner == null)
            {
                if (GUI.Button(new Rect(0, 0, 200, 40), "Shared"))
                {
                    StartGame(GameMode.Shared);
                }
            }
            else
            {
                GUI.Label(new Rect(0, 0, 200, 40), $"Voice Status: {UniWebConference.Instance.State}");
                GUI.Label(new Rect(0, 50, 200, 40), $"Users in voice: {UniWebConference.Instance.JoinedUsers.Count}");

                if (UniWebConference.Instance.State == UniWebConference.ConnectionState.Connected)
                {
                    if (GUI.Button(new Rect(0, 100, 200, 40), "Join Voice Channel"))
                    {
                        UniWebConference.Instance.JoinChannel();
                    }
                }
            }
        }

        #region Voice Chat

        private void Update()
        {
            // This will check for each user and will take care about spatial audio based on distance
            _connectedUsers.ForEach(UniWebConference.Instance.ProcessSpatialAudio);

            if (Input.GetKeyDown(KeyCode.R))
            {
                _isMuted = !_isMuted;

                UniWebConference.Instance.SetMuteStatusAudio(_isMuted);
            }
        }

        private void UserConnectedEventHandler(UniWebConference.User user)
        {
            _connectedUsers.Add(user);

            // Attach vocie of user on its game object in scene (its player)
            user.AttachOn(GetNetworkObjectByUserId(user.UserInfo.name).transform);
        }

        private void UserDisconnectedEventHandler(UniWebConference.User user)
        {
            _connectedUsers.Remove(user);
        }

        private void StreamBeganEventHandler()
        {
            Debug.Log("StreamBeganEventHandler");

            UniWebConference.Instance.JoinChannel();
        }

        private void StreamFailedEventHandler(string error)
        {
            Debug.Log(error);
        }

        private void ChannelJoinFailedEventHandler(string error)
        {
            Debug.Log(error);
        }

        private void ConnectFailedEventHandler(string error)
        {
            Debug.Log(error);
        }

        private void ConnectUserToVoiceChat()
        {
            if (UniWebConference.Instance.State == UniWebConference.ConnectionState.Connected)
            {
                UniWebConference.Instance.SetUser(new UniWebConference.UserInfo()
                {
                    name = _playerName
                });

                UniWebConference.Instance.BeginMediaStream(false, true); // only audio
            }
            else
            {
                _beganStreamAfterConnection = true;
                // Try to connect if disconnected
                UniWebConference.Instance.Connect();
            }
        }

        private void DisconnectUserFromVoiceChat()
        {
            if (UniWebConference.Instance.State == UniWebConference.ConnectionState.JoinedChannel)
            {
                UniWebConference.Instance.LeaveChannel();
            }
        }

        private void ConnectedEventHandler()
        {
            if (_beganStreamAfterConnection)
            {
                _beganStreamAfterConnection = false;
                ConnectUserToVoiceChat();
            }
        }

        private void DisconnectedEventEventHandler()
        {
            Debug.Log("DisconnectedEventEventHandler");
        }

        private void ChannelJoinedEventHandler()
        {
            Debug.Log("ChannelJoinedEventHandler");
        }

        private void ChannelLeftEventHandler()
        {
            Debug.Log("ChannelLeftEventHandler");
            _connectedUsers.Clear();
        }

        #endregion

        public class NetworkTarget
        {
            private MeshRenderer _meshRenderer;

            public string userId;
            public PlayerRef playerRef;
            public NetworkObject networkObject;

            public UniWebConference.User conferenceUser;

            public NetworkTarget(NetworkObject networkObject)
            {
                this.networkObject = networkObject;
            }

            public void Update()
            {

            }
        }
#endif
    }
}
