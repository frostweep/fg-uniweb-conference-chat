using FrostweepGames.UniWebConferencePro.Common;
using UnityEngine;

namespace FrostweepGames.UniWebConferencePro.Tools
{
    public class UWCP_SpatialAudioGizmos : MonoBehaviour
    {
        private bool _ready;

        private GameObject[] _spheres;

        public Material material;

        private void Start()
        {
            _ready = material;

            if (_ready)
            {
                _spheres = new GameObject[2];

                MeshRenderer meshRenderer;
                for (int i = 0; i < _spheres.Length; i++)
                {
                    _spheres[i] = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                    Destroy(_spheres[i].GetComponent<Collider>());
                    meshRenderer = _spheres[i].GetComponent<MeshRenderer>();
                    meshRenderer.sharedMaterial = Instantiate(material);
                    Color color = i == 0 ? Color.cyan : Color.blue;
                    color.a = 0.05f;
                    meshRenderer.sharedMaterial.color = color;
                    _spheres[i].transform.SetParent(gameObject.transform, false);
                }
            }
        }

        private void LateUpdate()
        {
            if (_ready)
            {
                for (int i = 0; i < _spheres.Length; i++)
                {
                    _spheres[i].transform.localScale = i == 0 ? (Vector3.one * GeneralConfig.Config.spatialAudioMinimalHearRadius * 2) : (Vector3.one * GeneralConfig.Config.spatialAudioRadius * 2);
                }
            }
        }

        private void OnDestroy()
        {
            if (_ready)
            {
                for (int i = 0; i < _spheres.Length; i++)
                {
                    Destroy(_spheres[i].GetComponent<MeshRenderer>().sharedMaterial);
                    Destroy(_spheres[i]);
                }
                _spheres = null;
            }
        }
    }
}