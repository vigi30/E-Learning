using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ship : MonoBehaviour
{
    // inputs for the ship to move.
    Rigidbody2D ship;
    
    const float ThrustForce=10f;

    Vector2 thrustDirection;
    //input for getting radius of the circle.

    float shipRadius;
    float shipDiameter;

    // Start is called before the first frame update
    void Start()
    {
        ship = gameObject.GetComponent<Rigidbody2D>();
        
        shipRadius=GetComponent<CircleCollider2D>().radius;
        shipDiameter = shipRadius * 2;

        

    }

    // Update is called once per frame
    void FixedUpdate()
    {
        

    }

     void Update()
    {
        const float rotateDegreesPerSecond = 200;
        float radian,degree;

        float thrustInput = Input.GetAxis("Thrust");
        float rotateInput = Input.GetAxis("Rotate");
        if (rotateInput > 0)
        {
            
            transform.Rotate(Vector3.forward, rotateDegreesPerSecond*Time.deltaTime, Space.Self);
            degree = gameObject.transform.eulerAngles.z;
            radian = degree * Mathf.Deg2Rad;
            thrustDirection = new Vector2(Mathf.Cos(radian), Mathf.Sin(radian));
            if (thrustInput != 0)
            {
                ship.AddForce(ThrustForce * thrustDirection, ForceMode2D.Force);
            }



        } 
        else if (rotateInput < 0)
        {
            print("left");
            transform.Rotate(Vector3.forward, -rotateDegreesPerSecond* Time.deltaTime, Space.Self);
            degree = gameObject.transform.eulerAngles.z;
            radian = degree * Mathf.Deg2Rad;
            thrustDirection = new Vector2(Mathf.Cos(radian), Mathf.Sin(radian));
            if (thrustInput != 0)
            {
                ship.AddForce(ThrustForce * thrustDirection, ForceMode2D.Force);
            }

        }
        //float rotationAmount = rotateDegreesPerSecond * Time.deltaTime;
        //if (rotationInput < 0) { rotationAmount *= -1; }
        //transform.Rotate(Vector3.forward, rotationAmount);
        else if(thrustInput != 0)
        {
            ship.AddForce(ThrustForce * thrustDirection, ForceMode2D.Force);
        }

    }
    

    void OnBecameInvisible()
    {
        Vector3 position = gameObject.transform.position;
        
        
        if(position.x + shipRadius > ScreenUtils.ScreenRight) 
        {
            position.x = ScreenUtils.ScreenLeft- shipRadius;
        }
        else if(position.x - shipRadius <  ScreenUtils.ScreenLeft) 
        {
            position.x = ScreenUtils.ScreenRight - shipRadius;
        }
       
        

        if (position.y + shipRadius > ScreenUtils.ScreenTop) 
        {
            position.y = ScreenUtils.ScreenBottom - shipRadius;
        }
        else if (position.y - shipRadius < ScreenUtils.ScreenBottom)

        {
            position.y = ScreenUtils.ScreenTop - shipRadius;
        }
        transform.position = position;
        

    }
}
