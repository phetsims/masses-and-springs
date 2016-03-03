// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/MassNode' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/OscillatingSpringNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var MASRulerNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/MASRulerNode' );
  var Line = require( 'SCENERY/nodes/Line' );

  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function MassesAndSpringsScreenView( model ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768 * 2, 504 * 3
    ) } );

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .9 ),
      1000 );
    this.mvt = mvt; // Make mvt available to descendant types.

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      radius: 48,
      right:  this.layoutBounds.maxX - 10,
      bottom: mvt.modelToViewY( model.floorY )
    } );
    this.addChild( resetAllButton );

    this.addChild( new MASRulerNode( mvt, this.layoutBounds, model.ruler ) );

    this.referenceLine = new Line( 0, 0, mvt.modelToViewDeltaX( 0.52 ), 0, {
      stroke: 'blue',
      lineDash: [ 20, 15 ],
      lineWidth: 4,
      cursor: 'pointer',
      boundsMethod: 'unstroked'
    } );
    this.referenceLine.mouseArea = this.referenceLine.localBounds.dilated( 10 );
    this.referenceLine.touchArea = this.referenceLine.localBounds.dilated( 10 );

    this.referenceLine.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the line in model space.
      translate: function( translationParams ) {
        model.referenceLinePosition = model.referenceLinePosition.plus( mvt.viewToModelDelta( translationParams.delta ) );
        return translationParams.position;
      }
    } ) );
    model.referenceLinePositionProperty.link( function( position ) {
      var newPosition = mvt.modelToViewPosition( position );
      self.referenceLine.translation = newPosition;
    } );
    this.addChild( this.referenceLine );


    self.addChild( new MassNode( model.masses[0], mvt, 'grey', true ) );
    self.addChild( new MassNode( model.masses[1], mvt, 'grey', true ) );
    self.addChild( new MassNode( model.masses[2], mvt, 'grey', true ) );
    self.addChild( new MassNode( model.masses[3], mvt, 'red', false ) );
    self.addChild( new MassNode( model.masses[4], mvt, 'blue', false ) );
    self.addChild( new MassNode( model.masses[5], mvt, 'green', false ) );

//    var massNode = new MassNode( model.masses[0], mvt );
//    model.masses.forEach( function ( mass ) {
//      self.addChild( new MassNode( mass, mvt) );
//    } );
    model.springs.forEach( function ( spring ) {
      self.addChild( new OscillatingSpringNode( spring, mvt ) );
    } );

    // FROM BAIntroView TODO Apapt to MAS???
    //model.massList.forEach( function( mass ) {
    //  // Add a listener for when the user drops the mass.  This is done here
    //  // in this case, rather than in the model, because we need to check
    //  // whether or not the user dropped it on the "stage" so that it isn't
    //  // permanently dragged off of the screen.
    //  mass.userControlledProperty.lazyLink( function( userControlled ) {
    //    if ( !userControlled ) {
    //      // The user has dropped this mass.
    //      if ( !model.plank.addMassToSurface( mass ) ) {
    //        // The attempt to add mass to surface of plank failed,
    //        // probably because mass was dropped somewhere other
    //        // than over the plank.
    //        if ( thisScreen.mvt.modelToViewX( mass.position.x ) > thisScreen.layoutBounds.minX && thisScreen.mvt.modelToViewX( mass.position.x ) < thisScreen.layoutBounds.maxX ) {
    //          // Mass is in the visible area, so just
    //          // drop it on the ground.
    //          mass.position = new Vector2( mass.position.x, 0 );
    //        }
    //        else {
    //          // Mass is off stage.  Return it to its original position.
    //          mass.positionProperty.reset();
    //        }
    //      }
    //    }
    //  } );
    //} );


  }

  massesAndSprings.register( 'MassesAndSpringsScreenView', MassesAndSpringsScreenView );

  return inherit( ScreenView, MassesAndSpringsScreenView );
} );