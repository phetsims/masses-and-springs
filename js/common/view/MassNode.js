// Copyright 2017-2018, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  var ForcesModeChoice = require( 'MASSES_AND_SPRINGS/common/enum/ForcesModeChoice' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var VectorArrow = require( 'MASSES_AND_SPRINGS/common/view/VectorArrow' );

  // strings
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );
  var questionMarkString = require( 'string!MASSES_AND_SPRINGS/questionMark' );

  // constants
  var ARROW_SIZE_DEFAULT = 25;

  /**
   * @param {Mass} mass - model object
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MassNode( mass, modelViewTransform2, dragBoundsProperty, model, tandem ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    // @public {Mass} (read-only)
    this.mass = mass;

    var hookHeight = modelViewTransform2.modelToViewDeltaY( -MassesAndSpringsConstants.HOOK_HEIGHT );
    if ( mass.icon ) {
      hookHeight = modelViewTransform2.modelToViewDeltaY( -MassesAndSpringsConstants.HOOK_HEIGHT * 0.34 );
    }

    var rect = new Rectangle( {
      stroke: 'black',
      lineWidth: 0.5
    } );
    this.addChild( rect );

    // Bounds that limit where we can drag our mass should be dependent on how large our mass is
    var modelBoundsProperty = new DerivedProperty( [ dragBoundsProperty, mass.heightProperty ], function( dragBounds, massHeight ) {
      var modelBounds = modelViewTransform2.viewToModelBounds( dragBounds );
      modelBounds.minY += massHeight;
      return modelBounds;
    } );

    // Update the size of the massNode
    mass.radiusProperty.link( function( radiusValue ) {

      rect.rectBounds = new Bounds2(
        modelViewTransform2.modelToViewDeltaX( -radiusValue ),
        hookHeight,
        modelViewTransform2.modelToViewDeltaX( radiusValue ),
        modelViewTransform2.modelToViewDeltaY( -mass.cylinderHeightProperty.get() ) + hookHeight );

      rect.fill = new LinearGradient( -rect.width / 2, 0, rect.width / 2, 0 )
        .addColorStop( 0, Color.toColor( mass.color ).colorUtilsBrighter( 0.3 ) )
        .addColorStop( 0.2, Color.toColor( mass.color ).colorUtilsBrighter( 0.8 ) )
        .addColorStop( 0.7, mass.color );

      // We are constraining the draggable bounds on our massNodes except when the mass is attached to a spring.
      var minY = mass.userControlledProperty.value ?
                 modelBoundsProperty.value.minY :
                 MassesAndSpringsConstants.FLOOR_Y + MassesAndSpringsConstants.SHELF_HEIGHT + mass.heightProperty.value;

      if ( mass.positionProperty.value.y < minY && !mass.springProperty.value ) {
        mass.positionProperty.set( new Vector2( mass.positionProperty.value.x, minY ) );
      }
    } );

    // Sets the gradient on the massNode.
    rect.fill = new LinearGradient( -rect.width / 2, 0, rect.width / 2, 0 )
      .addColorStop( 0, Color.toColor( mass.color ).colorUtilsBrighter( 0.1 ) )
      .addColorStop( 0.2, Color.toColor( mass.color ).colorUtilsBrighter( 0.6 ) )
      .addColorStop( 0.7, mass.color );

    var hookShape = new Shape();
    var radius = hookHeight / 4;
    hookShape.arc( 0, 0, radius, Math.PI, ( 0.5 * Math.PI ) );
    hookShape.lineTo( 0, hookHeight / 2 );
    var hookNode = new Path( hookShape, {
      stroke: 'black',
      lineWidth: 1.5,
      lineCap: 'round',
      centerX: rect.centerX,
      bottom: rect.top
    } );
    this.addChild( hookNode );

    if ( !mass.icon ) {
      var labelString = mass.mysteryLabel ? questionMarkString : StringUtils.fillIn( massValueString, { mass: mass.mass * 1000 } );
      var label = new Text( labelString, {
        font: new PhetFont( { size: 12, weight: 'bold' } ),
        centerY: rect.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: !mass.adjustable ? rect.width : 30, // Adjustable masses require smaller label maxWidth.
        tandem: tandem.createTandem( 'label' )
      } );
      this.addChild( label );

      mass.massProperty.link( function() {
        label.center = rect.center;
      } );

      // Adjust the mass label for adjustable masses.
      if ( this.mass.adjustable ) {
        this.mass.massProperty.link( function( massValue ) {
          label.setText( StringUtils.fillIn( massValueString, { mass: Util.roundSymmetric( massValue * 1000 ) } ) );
          label.center = rect.center;
        } );
      }
    }

    // @public {MovableDragHandler} (read-write)
    this.movableDragHandler = new MovableDragHandler( this.mass.positionProperty, {

      // Allow moving a finger (touch) across a node to pick it up.
      dragBounds: modelBoundsProperty.value,
      allowTouchSnag: true,
      modelViewTransform: modelViewTransform2,
      tandem: tandem.createTandem( 'dragHandler' ),

      // Handler that moves the particle in model space.
      onDrag: function() {

        if ( self.mass.springProperty.value ) {
          self.mass.springProperty.value.buttonEnabledProperty.set( false );
        }

        // Checks if mass should be attached/detached to spring and adjusts its position if so.
        model.adjustDraggedMassPosition( self.mass, dragBoundsProperty.value );
      },
      startDrag: function() {
        mass.userControlledProperty.set( true );

        if ( self.mass.springProperty.value ) {
          self.mass.springProperty.value.buttonEnabledProperty.set( false );
        }
        self.moveToFront();
      },
      endDrag: function() {
        mass.userControlledProperty.set( false );
        if ( mass.springProperty.value ) {
          mass.springProperty.value.droppedEmitter.emit();
        }
      }
    } );


    this.mass.positionProperty.link( function( position ) {
      self.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    modelBoundsProperty.link( function( modelDragBounds ) {
      self.movableDragHandler.setDragBounds( modelDragBounds );
    } );

    this.addInputListener( this.movableDragHandler );

    var forceNullLine = new Line( {
      stroke: 'black',
      cursor: 'pointer'
    } );

    // Arrows created for vectors associated with mass nodes
    var velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    var accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    var gravityForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    var springForceArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    var netForceArrow = new ForceVectorArrow( 'black' );

    if ( !mass.icon ) {
      this.addChild( velocityArrow );
      this.addChild( accelerationArrow );
      this.addChild( gravityForceArrow );
      this.addChild( springForceArrow );
      this.addChild( netForceArrow );
      this.addChild( forceNullLine );
    }

    // Used to position the vectors on the left of right side of the massNode depending on the attached spring.
    var forcesOrientation = 1;
    this.mass.springProperty.link( function( spring ) {
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
    var updateArrowVisibility = function( arrowVisibilityProperty, arrowNode ) {
      Property.multilink( [ mass.springProperty, arrowVisibilityProperty, mass.userControlledProperty ],
        function( spring, vectorVisibility, userControlled ) {
          arrowNode.visible = !!spring && vectorVisibility && !userControlled;
        } );
    };

    /**
     * Show/hide the spring and gravity force vectors when appropriate
     * @param {Property.<boolean>} arrowVisibilityProperty
     * @param {Node} arrowNode
     *
     * @private
     */
    var updateForceVisiblity = function( arrowVisibilityProperty, arrowNode ) {
      Property.multilink( [ mass.springProperty, arrowVisibilityProperty, model.forcesModeProperty ],
        function( spring, springVectorVisibility, forcesMode ) {
          arrowNode.visible = !!spring && springVectorVisibility && forcesMode === ForcesModeChoice.FORCES;
        } );
    };

    // Show/hide the velocity arrow
    updateArrowVisibility( model.velocityVectorVisibilityProperty, velocityArrow );

    // Show/hide the acceleration arrow
    updateArrowVisibility( model.accelerationVectorVisibilityProperty, accelerationArrow );

    // Show/hide the spring force arrow
    updateForceVisiblity( model.springVectorVisibilityProperty, springForceArrow );

    // Show/hide the gravity force arrow
    updateForceVisiblity( model.gravityVectorVisibilityProperty, gravityForceArrow );

    // Show/hide the net force arrow
    Property.multilink( [ mass.springProperty, model.forcesModeProperty ],
      function( spring, forcesMode ) {
        netForceArrow.visible = !!spring && forcesMode === ForcesModeChoice.NET_FORCES;
      }
    );

    // Show/hide line at base of vectors
    Property.multilink( [ mass.springProperty, model.gravityVectorVisibilityProperty, model.springVectorVisibilityProperty, model.forcesModeProperty ],
      function( spring, gravityForceVisible, springForceVisible, forcesMode ) {
        forceNullLine.visible = !!spring && ( gravityForceVisible || springForceVisible || forcesMode === ForcesModeChoice.NET_FORCES );
      } );

    /**
     * Updates the arrow by using .setTailAndTip(). Used to make code concise.
     *
     * @param {VectorArrow|ForceVectorArrow} arrow - arrow to be updated
     * @param {Vector2} position
     * @param {number} xOffset
     * @param {number} y2 - number that will be used for y2 value in setTailAndTip()
     */
    var updateArrow = function( arrow, position, xOffset, y2 ) {
      arrow.setTailAndTip(
        rect.centerX + xOffset,
        position.y + rect.centerY,
        rect.centerX + xOffset,
        position.y + rect.centerY + y2
      );
    };

    // Links for handling the length of the vectors in response to the system.
    var scalingFactor = 3;
    var xOffset;
    var y2;
    var position;
    Property.multilink( [ mass.verticalVelocityProperty, model.velocityVectorVisibilityProperty, model.accelerationVectorVisibilityProperty ], function( velocity, visible, accelerationVisible ) {
      if ( visible ) {
        xOffset = accelerationVisible ? -8 : 0;
        position = mass.positionProperty.get();
        y2 = -ARROW_SIZE_DEFAULT * velocity * scalingFactor;
        updateArrow( velocityArrow, position, xOffset, y2 );
      }
    } );

    // When gravity changes, update the gravitational force arrow
    Property.multilink( [ mass.springProperty, mass.gravityProperty, model.gravityVectorVisibilityProperty ], function( spring, gravity, visible ) {
      if ( visible ) {
        var gravitationalAcceleration = mass.mass * gravity;
        position = mass.positionProperty.get();
        xOffset = (forcesOrientation) * 45;
        y2 = ARROW_SIZE_DEFAULT * gravitationalAcceleration;
        updateArrow( gravityForceArrow, position, xOffset, y2 );
      }
    } );

    // When the spring force changes, update the spring force arrow
    Property.multilink( [ mass.springForceProperty, model.springVectorVisibilityProperty ], function( springForce, visible ) {
      if ( visible ) {
        position = mass.positionProperty.get();
        xOffset = (forcesOrientation) * 45;
        y2 = ARROW_SIZE_DEFAULT * springForce;
        updateArrow( springForceArrow, position, xOffset, y2 );
      }
    } );

    // When net force changes changes, update the net force arrow
    assert && assert( mass.springProperty.get() === null, 'We currently assume that the masses don\'t start attached to the springs' );
    Property.multilink( [
      mass.netForceProperty,
      model.forcesModeProperty,
      model.accelerationVectorVisibilityProperty,
      mass.accelerationProperty,
      model.velocityVectorVisibilityProperty
    ], function( netForce, forcesMode, accelerationVisible, netAcceleration, velocityVisible ) {
      position = mass.positionProperty.get();
      if ( forcesMode === ForcesModeChoice.NET_FORCES ) {
        if ( Math.abs( netForce ) > 1E-6 ) {
          xOffset = (forcesOrientation) * 45;
          y2 = -ARROW_SIZE_DEFAULT * netForce;
          updateArrow( netForceArrow, position, xOffset, y2 );
        }
        else if ( netAcceleration === 0 ) {
          netForceArrow.setTailAndTip( 0, 0, 0, 0 );
        }
      }
      if ( accelerationVisible ) {
        if ( Math.abs( netAcceleration ) > 1E-6 ) {
          xOffset = velocityVisible ? 8 : 0;
          y2 = -ARROW_SIZE_DEFAULT * netAcceleration / scalingFactor;
          updateArrow( accelerationArrow, position, xOffset, y2 );
        }
        else if ( netAcceleration === 0 ) {
          accelerationArrow.setTailAndTip( 0, 0, 0, 0 );
        }
      }
    } );

    // When the mass's position changes update the forces baseline marker
    mass.positionProperty.link( function( position ) {
      forceNullLine.setLine( rect.centerX + (forcesOrientation) * 40, position.y + rect.centerY, rect.centerX + (forcesOrientation) * 50, position.y + rect.centerY );
    } );
  }

  massesAndSprings.register( 'MassNode', MassNode );
  return inherit( Node, MassNode );
} );
