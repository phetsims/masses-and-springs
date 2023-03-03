// Copyright 2017-2023, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, DragListener, Line, LinearGradient, Node, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import ForcesMode from '../model/ForcesMode.js';
import ForceVectorArrow from './ForceVectorArrow.js';
import VectorArrow from './VectorArrow.js';

const massValueString = MassesAndSpringsStrings.massValue;
const questionMarkString = MassesAndSpringsStrings.questionMark;

// constants
const ARROW_SIZE_DEFAULT = 25;

class MassNode extends Node {
  /**
   * @param {Mass} mass - model object
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   */
  constructor( mass, modelViewTransform2, dragBoundsProperty, model, tandem ) {
    super( { cursor: 'pointer' } );

    // @public {Mass} (read-only)
    this.mass = mass;

    // @public (read-write) determines if the mass's velocity is below a specific value, so the period trace is hidden.
    this.thresholdReached = false;

    let hookHeight = modelViewTransform2.modelToViewDeltaY( -MassesAndSpringsConstants.HOOK_HEIGHT );
    if ( mass.icon ) {
      hookHeight = modelViewTransform2.modelToViewDeltaY( -MassesAndSpringsConstants.HOOK_HEIGHT * 0.34 );
    }

    // @public {Rectangle}
    this.rect = new Rectangle( {
      stroke: 'black',
      boundsMethod: 'unstroked',
      lineWidth: 0.5
    } );
    this.addChild( this.rect );

    // Bounds that limit where we can drag our mass should be dependent on how large our mass is
    const modelBoundsProperty = new DerivedProperty( [ dragBoundsProperty, mass.heightProperty ],
      ( dragBounds, massHeight ) => {
        const modelBounds = modelViewTransform2.viewToModelBounds( dragBounds );
        modelBounds.minY += massHeight;
        return modelBounds;
      } );

    // Update the size of the massNode. Link exists for sim duration. No need to unlink.
    mass.radiusProperty.link( radiusValue => {

      this.rect.rectBounds = new Bounds2(
        modelViewTransform2.modelToViewDeltaX( -radiusValue ),
        hookHeight,
        modelViewTransform2.modelToViewDeltaX( radiusValue ),
        modelViewTransform2.modelToViewDeltaY( -mass.cylinderHeightProperty.get() ) + hookHeight );

      this.rect.fill = new LinearGradient( -this.rect.width / 2, 0, this.rect.width / 2, 0 )
        .addColorStop( 0, Color.toColor( mass.color ).colorUtilsBrighter( 0.3 ) )
        .addColorStop( 0.2, Color.toColor( mass.color ).colorUtilsBrighter( 0.8 ) )
        .addColorStop( 0.7, mass.color );

      // We are constraining the draggable bounds on our massNodes except when the mass is attached to a spring.
      const minY = mass.userControlledProperty.value ?
                   modelBoundsProperty.value.minY :
                   MassesAndSpringsConstants.FLOOR_Y + MassesAndSpringsConstants.SHELF_HEIGHT + mass.heightProperty.value;

      if ( mass.positionProperty.value.y < minY && !mass.springProperty.value ) {
        mass.positionProperty.set( new Vector2( mass.positionProperty.value.x, minY ) );
      }
    } );

    // Sets the gradient on the massNode.
    this.rect.fill = new LinearGradient( -this.rect.width / 2, 0, this.rect.width / 2, 0 )
      .addColorStop( 0, Color.toColor( mass.color ).colorUtilsBrighter( 0.1 ) )
      .addColorStop( 0.2, Color.toColor( mass.color ).colorUtilsBrighter( 0.6 ) )
      .addColorStop( 0.7, mass.color );

    const hookShape = new Shape();
    const radius = hookHeight / 4;
    hookShape.arc( 0, 0, radius, Math.PI, ( 0.5 * Math.PI ) );
    hookShape.lineTo( 0, hookHeight / 2 );

    // @public {Path} Used for hook on massNode.
    this.hookNode = new Path( hookShape, {
      stroke: 'black',
      lineWidth: 1.5,
      lineCap: 'round',
      centerX: this.rect.centerX,
      boundsMethod: 'unstroked',
      bottom: this.rect.top
    } );
    this.addChild( this.hookNode );

    // Background added so all of svg elements are painted.
    // See https://github.com/phetsims/masses-and-springs/issues/278
    this.background = new Rectangle( this.bounds.dilated( 1.25 ), { pickable: false, fill: 'transparent' } );
    this.addChild( this.background );

    if ( !mass.icon ) {
      const labelString = mass.mysteryLabel ?
                          questionMarkString : StringUtils.fillIn( massValueString, { mass: mass.mass * 1000 } );
      const label = new Text( labelString, {
        font: new PhetFont( { size: 12, weight: 'bold' } ),
        centerY: this.rect.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: !mass.adjustable ? this.rect.width : 30, // Adjustable masses require smaller label maxWidth.
        tandem: tandem.createTandem( 'labelText' )
      } );
      this.addChild( label );

      mass.massProperty.link( () => {
        label.center = this.rect.center;
      } );

      // Adjust the mass label for adjustable masses.
      if ( this.mass.adjustable ) {
        this.mass.massProperty.link( massValue => {
          label.setString( StringUtils.fillIn( massValueString, { mass: Utils.roundSymmetric( massValue * 1000 ) } ) );
          label.center = this.rect.center;
        } );
      }
    }

    // Handler that moves the particle in model space.
    const onDrag = () => {

      if ( this.mass.springProperty.value ) {
        this.mass.springProperty.value.buttonEnabledProperty.set( false );
      }

      // Checks if mass should be attached/detached to spring and adjusts its position if so.
      model.adjustDraggedMassPosition( this.mass, dragBoundsProperty.value );
    };

    // @public {DragListener} (read-write)
    this.dragListener = new DragListener( {
      positionProperty: this.mass.positionProperty,
      useParentOffset: true,

      // Allow moving a finger (touch) across a node to pick it up.
      dragBoundsProperty: modelBoundsProperty,
      allowTouchSnag: true,
      transform: modelViewTransform2,
      tandem: tandem.createTandem( 'dragListener' ),

      start: () => {
        onDrag();
        mass.userControlledProperty.set( true );

        if ( this.mass.springProperty.value ) {
          this.mass.springProperty.value.buttonEnabledProperty.set( false );
        }
        this.moveToFront();
      },
      end: () => {
        onDrag();
        mass.userControlledProperty.set( false );
        if ( mass.springProperty.value ) {
          mass.springProperty.value.periodTraceResetEmitter.emit();
        }
      }
    } );

    this.mass.positionProperty.link( position => {
      this.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    Multilink.multilink( [ mass.userControlledProperty, modelBoundsProperty ], ( ( userControlled, modelDragBounds ) => {

      // Masses won't jump back into the model bounds attached to spring.
      // See https://github.com/phetsims/masses-and-springs/issues/291
      if ( mass.springProperty.value && !userControlled ) {
        this.dragListener.dragBounds.set( Bounds2.EVERYTHING );
      }
      else {
        this.dragListener.dragBounds.set( modelDragBounds );
      }
    } ) );

    this.addInputListener( this.dragListener );

    const forceNullLine = new Line( {
      stroke: 'black',
      cursor: 'pointer'
    } );

    // Arrows created for vectors associated with mass nodes
    const velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    const accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    const gravityForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    const springForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    const netForceArrow = new ForceVectorArrow( 'black' );

    if ( !mass.icon ) {
      this.addChild( velocityArrow );
      this.addChild( accelerationArrow );
      this.addChild( gravityForceArrow );
      this.addChild( springForceArrow );
      this.addChild( netForceArrow );
      this.addChild( forceNullLine );
    }

    // Used to position the vectors on the left of right side of the massNode depending on the attached spring.
    let forcesOrientation = 1;
    this.mass.springProperty.link( spring => {
      if ( spring ) {
        forcesOrientation = spring.forcesOrientationProperty.value;
      }
    } );

    /**
     * Show/hide the velocity and acceleration arrows when appropriate
     * @param {Property.<boolean>} arrowVisibilityProperty
     * @param {Node} arrowNode
     *
     */
    const updateArrowVisibility = ( arrowVisibilityProperty, arrowNode ) => {
      Multilink.multilink( [ mass.springProperty, arrowVisibilityProperty, mass.userControlledProperty ],
        ( spring, vectorVisibility, userControlled ) => {
          arrowNode.visible = !!spring && vectorVisibility && !userControlled;
        } );
    };

    /**
     * Show/hide the spring and gravity force vectors when appropriate
     * @param {Property.<boolean>} arrowVisibilityProperty
     * @param {Node} arrowNode
     *
     */
    const updateForceVisibility = ( arrowVisibilityProperty, arrowNode ) => {
      Multilink.multilink( [ mass.springProperty, arrowVisibilityProperty, model.forcesModeProperty ],
        ( spring, springVectorVisibility, forcesMode ) => {
          arrowNode.visible = !!spring && springVectorVisibility && forcesMode === ForcesMode.FORCES;
        } );
    };

    // Show/hide the velocity arrow
    updateArrowVisibility( model.velocityVectorVisibilityProperty, velocityArrow );

    // Show/hide the acceleration arrow
    updateArrowVisibility( model.accelerationVectorVisibilityProperty, accelerationArrow );

    // Show/hide the spring force arrow
    updateForceVisibility( model.springVectorVisibilityProperty, springForceArrow );

    // Show/hide the gravity force arrow
    updateForceVisibility( model.gravityVectorVisibilityProperty, gravityForceArrow );

    // Show/hide the net force arrow
    Multilink.multilink( [ mass.springProperty, model.forcesModeProperty ],
      ( spring, forcesMode ) => {
        netForceArrow.visible = !!spring && forcesMode === ForcesMode.NET_FORCES;
      } );

    // Show/hide line at base of vectors
    Multilink.multilink( [
        mass.springProperty,
        model.gravityVectorVisibilityProperty,
        model.springVectorVisibilityProperty,
        model.forcesModeProperty
      ],
      ( spring, gravityForceVisible, springForceVisible, forcesMode ) => {
        forceNullLine.visible = !!spring && ( gravityForceVisible || springForceVisible || forcesMode === ForcesMode.NET_FORCES );
      } );

    /**
     * Updates the arrow by using .setTailAndTip(). Used to make code concise.
     *
     * @param {VectorArrow|ForceVectorArrow} arrow - arrow to be updated
     * @param {Vector2} position
     * @param {number} xOffset
     * @param {number} y2 - number that will be used for y2 value in setTailAndTip()
     */
    const updateArrow = ( arrow, position, xOffset, y2 ) => {
      arrow.setTailAndTip(
        this.rect.centerX + xOffset,
        position.y + this.rect.centerY,
        this.rect.centerX + xOffset,
        position.y + this.rect.centerY + y2
      );
    };

    // Links for handling the length of the vectors in response to the system.
    const scalingFactor = 3;
    let xOffset;
    let y2;
    let position;
    Multilink.multilink( [
      mass.verticalVelocityProperty,
      model.accelerationVectorVisibilityProperty
    ], ( velocity, accelerationVisible ) => {
      xOffset = accelerationVisible ? -8 : 0;
      position = mass.positionProperty.get();
      y2 = -ARROW_SIZE_DEFAULT * velocity * scalingFactor;
      updateArrow( velocityArrow, position, xOffset, y2 );
    } );

    // When gravity changes, update the gravitational force arrow
    Multilink.multilink( [ mass.springProperty, mass.gravityProperty ],
      ( spring, gravity ) => {
        const gravitationalAcceleration = mass.mass * gravity;
        position = mass.positionProperty.get();
        xOffset = forcesOrientation * 45;
        y2 = ARROW_SIZE_DEFAULT * gravitationalAcceleration;
        updateArrow( gravityForceArrow, position, xOffset, y2 );
      } );

    // When the spring force changes, update the spring force arrow
    Multilink.multilink( [ mass.springForceProperty ],
      springForce => {
        position = mass.positionProperty.get();
        xOffset = forcesOrientation * 45;
        y2 = -ARROW_SIZE_DEFAULT * springForce;
        updateArrow( springForceArrow, position, xOffset, y2 );
      } );

    // When net force changes changes, update the net force arrow
    assert && assert( mass.springProperty.get() === null, 'We currently assume that the masses don\'t start attached to the springs' );
    Multilink.multilink( [
      mass.netForceProperty,
      model.accelerationVectorVisibilityProperty,
      mass.accelerationProperty,
      model.velocityVectorVisibilityProperty
    ], ( netForce, accelerationVisible, netAcceleration, velocityVisible ) => {
      position = mass.positionProperty.get();
      if ( Math.abs( netForce ) > 1E-6 ) {
        xOffset = forcesOrientation * 45;
        y2 = -ARROW_SIZE_DEFAULT * netForce;
        updateArrow( netForceArrow, position, xOffset, y2 );
      }
      else {
        netForceArrow.setTailAndTip( 0, 0, 0, 0 );
      }
      if ( Math.abs( netAcceleration ) > 1E-6 ) {
        xOffset = velocityVisible ? 8 : 0;
        y2 = -ARROW_SIZE_DEFAULT * netAcceleration / scalingFactor;
        updateArrow( accelerationArrow, position, xOffset, y2 );
      }
      else {
        accelerationArrow.setTailAndTip( 0, 0, 0, 0 );
      }
    } );

    // When the mass's position changes update the forces baseline marker
    mass.positionProperty.link( position => {
      forceNullLine.setLine(
        this.rect.centerX + forcesOrientation * 40, position.y + this.rect.centerY,
        this.rect.centerX + forcesOrientation * 50, position.y + this.rect.centerY
      );
    } );
  }
}

massesAndSprings.register( 'MassNode', MassNode );

export default MassNode;